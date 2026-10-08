import "./App.css";

(function () {

  /* ---------- DOM shortcuts (defined early so buildDOM can use them) ---------- */
  function $(id) { return document.getElementById(id); }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  // ce = "create element" with an attribute map (supports boolean attrs like
  // required/hidden by passing an empty string value)
  function ce(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function field(labelText, inputEl) {
    var lbl = ce("label", { class: "field" });
    lbl.appendChild(ce("span", null, labelText));
    lbl.appendChild(inputEl);
    return lbl;
  }

  /* ---------- Build the entire UI into document.body ---------- */
  function buildDOM() {
    var body = document.body;

    /* Remove any copy left by a hot reload so the page never stacks/doubles up. */
    ["app", "toast"].forEach(function (oldId) {
      var old = document.getElementById(oldId);
      if (old) old.remove();
    });

    /* ===== Application shell ===== */
    var app = ce("div", { id: "app", class: "app", hidden: "" });

    var header = ce("header", { class: "topbar" });
    var menuToggle = ce("button", { id: "menu-toggle", class: "icon-btn", "aria-label": "Toggle navigation" });
    menuToggle.innerHTML = "&#9776;";
    header.appendChild(menuToggle);
    header.appendChild(ce("h1", { class: "brand" }, "Welcome To Our Community Library"));

    var topbarRight = ce("div", { class: "topbar-right" });
    topbarRight.appendChild(ce("span", { id: "current-user", class: "user-chip" }));
    header.appendChild(topbarRight);
    app.appendChild(header);

    var layout = ce("div", { class: "layout" });

    /* --- Sidebar --- */
    var sidebar = ce("nav", { id: "sidebar", class: "sidebar" });
    [
      ["dashboard", "Dashboard", true],
      ["books", "Book Management", false],
      ["transactions", "Transactions", false],
      ["users", "User Management", false]
    ].forEach(function (p) {
      var cls = "nav-link" + (p[2] ? " active" : "");
      sidebar.appendChild(ce("button", { class: cls, "data-page": p[0] }, p[1]));
    });
    layout.appendChild(sidebar);

    var main = ce("main", { class: "content" });

    /* --- Dashboard page --- */
    var pageDashboard = ce("section", { id: "page-dashboard", class: "page" });
    pageDashboard.appendChild(ce("h2", { class: "page-title" }, "Dashboard"));
    pageDashboard.appendChild(ce("div", { id: "stats", class: "stats" }));
    pageDashboard.appendChild(ce("h3", { class: "section-title" }, "Book we have in our library"));
    pageDashboard.appendChild(ce("div", { id: "dashboard-cards", class: "card-grid" }));
    main.appendChild(pageDashboard);

    /* --- Book management page --- */
    var pageBooks = ce("section", { id: "page-books", class: "page", hidden: "" });
    pageBooks.appendChild(ce("h2", { class: "page-title" }, "Book Management"));

    var bookForm = ce("form", { id: "book-form", class: "panel form-grid", autocomplete: "off" });
    bookForm.appendChild(ce("input", { type: "hidden", id: "book-id" }));
    bookForm.appendChild(field("Title", ce("input", { type: "text", id: "book-title", required: "" })));
    bookForm.appendChild(field("Author", ce("input", { type: "text", id: "book-author", required: "" })));

    var genreSelect = ce("select", { id: "book-genre", required: "" });
    [["", "Select genre"], ["Romance", "Romance"], ["Drama", "Drama"], ["Mystery", "Mystery"], ["History", "History"], ["Technology", "Technology"], ["Novel", "Novel"]]
      .forEach(function (o) { genreSelect.appendChild(ce("option", { value: o[0] }, o[1])); });
    bookForm.appendChild(field("Genre", genreSelect));

    bookForm.appendChild(field("ISBN", ce("input", { type: "text", id: "book-isbn", required: "" })));
    bookForm.appendChild(field("Quantity", ce("input", { type: "number", id: "book-qty", min: "0", value: "1", required: "" })));

    var bookActions = ce("div", { class: "form-actions" });
    bookActions.appendChild(ce("button", { type: "submit", class: "btn btn-primary", id: "book-submit" }, "Add Book"));
    bookActions.appendChild(ce("button", { type: "button", class: "btn btn-ghost", id: "book-cancel", hidden: "" }, "Cancel"));
    bookForm.appendChild(bookActions);
    pageBooks.appendChild(bookForm);

    var booksPanel = ce("div", { class: "panel" });
    var booksPanelHead = ce("div", { class: "panel-head" });
    booksPanelHead.appendChild(ce("h3", { class: "section-title" }, "All books"));
    booksPanelHead.appendChild(ce("input", { type: "search", id: "book-search", class: "search", placeholder: "Search title, author, ISBN..." }));
    booksPanel.appendChild(booksPanelHead);

    var booksTableWrap = ce("div", { class: "table-wrap" });
    var booksTable = ce("table", { class: "table" });
    var booksThead = ce("thead");
    var booksHeadRow = ce("tr");
    ["Title", "Author", "Genre", "ISBN", "Qty", "Status", "Actions"].forEach(function (h) { booksHeadRow.appendChild(ce("th", null, h)); });
    booksThead.appendChild(booksHeadRow);
    booksTable.appendChild(booksThead);
    booksTable.appendChild(ce("tbody", { id: "books-body" }));
    booksTableWrap.appendChild(booksTable);
    booksPanel.appendChild(booksTableWrap);
    pageBooks.appendChild(booksPanel);
    main.appendChild(pageBooks);

    /* --- Transactions page --- */
    var pageTxns = ce("section", { id: "page-transactions", class: "page", hidden: "" });
    pageTxns.appendChild(ce("h2", { class: "page-title" }, "Transactions"));

    var issueForm = ce("form", { id: "issue-form", class: "panel form-grid", autocomplete: "off" });
    issueForm.appendChild(field("Book", ce("select", { id: "txn-book", required: "" })));
    issueForm.appendChild(field("Member", ce("select", { id: "txn-user", required: "" })));
    issueForm.appendChild(field("Due date", ce("input", { type: "date", id: "txn-due", required: "" })));
    var issueActions = ce("div", { class: "form-actions" });
    issueActions.appendChild(ce("button", { type: "submit", class: "btn btn-primary" }, "Issue Book"));
    issueForm.appendChild(issueActions);
    pageTxns.appendChild(issueForm);

    var txnsPanel = ce("div", { class: "panel" });
    txnsPanel.appendChild(ce("h3", { class: "section-title" }, "All transactions"));
    var txnsTableWrap = ce("div", { class: "table-wrap" });
    var txnsTable = ce("table", { class: "table" });
    var txnsThead = ce("thead");
    var txnsHeadRow = ce("tr");
    ["Book", "Member", "Issued", "Due", "Returned", "Status", "Actions"].forEach(function (h) { txnsHeadRow.appendChild(ce("th", null, h)); });
    txnsThead.appendChild(txnsHeadRow);
    txnsTable.appendChild(txnsThead);
    txnsTable.appendChild(ce("tbody", { id: "txns-body" }));
    txnsTableWrap.appendChild(txnsTable);
    txnsPanel.appendChild(txnsTableWrap);
    pageTxns.appendChild(txnsPanel);
    main.appendChild(pageTxns);

    /* --- User management page --- */
    var pageUsers = ce("section", { id: "page-users", class: "page", hidden: "" });
    pageUsers.appendChild(ce("h2", { class: "page-title" }, "User Management"));

    var userForm = ce("form", { id: "user-form", class: "panel form-grid", autocomplete: "off" });
    userForm.appendChild(ce("input", { type: "hidden", id: "user-id" }));
    userForm.appendChild(field("Name", ce("input", { type: "text", id: "user-name", required: "" })));
    userForm.appendChild(field("Membership ID", ce("input", { type: "text", id: "user-memberid", required: "" })));

    var roleSelect = ce("select", { id: "user-role", required: "" });
    [["member", "Member"], ["librarian", "Librarian"], ["admin", "Admin"]]
      .forEach(function (o) { roleSelect.appendChild(ce("option", { value: o[0] }, o[1])); });
    userForm.appendChild(field("Role", roleSelect));

    var userActions = ce("div", { class: "form-actions" });
    userActions.appendChild(ce("button", { type: "submit", class: "btn btn-primary", id: "user-submit" }, "Add User"));
    userActions.appendChild(ce("button", { type: "button", class: "btn btn-ghost", id: "user-cancel", hidden: "" }, "Cancel"));
    userForm.appendChild(userActions);
    pageUsers.appendChild(userForm);

    var usersPanel = ce("div", { class: "panel" });
    usersPanel.appendChild(ce("h3", { class: "section-title" }, "All users"));
    var usersTableWrap = ce("div", { class: "table-wrap" });
    var usersTable = ce("table", { class: "table" });
    var usersThead = ce("thead");
    var usersHeadRow = ce("tr");
    ["Name", "Membership ID", "Role", "Actions"].forEach(function (h) { usersHeadRow.appendChild(ce("th", null, h)); });
    usersThead.appendChild(usersHeadRow);
    usersTable.appendChild(usersThead);
    usersTable.appendChild(ce("tbody", { id: "users-body" }));
    usersTableWrap.appendChild(usersTable);
    usersPanel.appendChild(usersTableWrap);
    pageUsers.appendChild(usersPanel);
    main.appendChild(pageUsers);

    layout.appendChild(main);
    app.appendChild(layout);
    body.appendChild(app);

    /* --- Toast --- */
    body.appendChild(ce("div", { id: "toast", class: "toast", hidden: "" }));
  }

  // Build the UI before anything below tries to look up elements by id.
  buildDOM();

  /* ---------- Storage helpers ---------- */
  var KEYS = { books: "lib_books", users: "lib_users", txns: "lib_txns", session: "lib_session" };

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  /* ---------- State ---------- */
  var books = load(KEYS.books, null);
  var users = load(KEYS.users, null);
  var txns = load(KEYS.txns, []);
  var session = load(KEYS.session, null);

  if (!users) {
    users = [
      { id: uid(), name: "Bokhabane", memberId: "901020604", role: "admin" },
      { id: uid(), name: "Millie", memberId: "59700294", role: "librarian" }
    ];
    save(KEYS.users, users);
  }
  if (!books) {
    books = [
      { id: uid(), title: "Mosali a nkhola", author: "M.S.Phafoli", genre: "Drama", isbn: "978-0798141235", qty: 10 },
      { id: uid(), title: "Meokho ea thabo", author: "S.M.Mofokeng", genre: "Romance", isbn: "978-0798103059", qty: 5 },
      { id: uid(), title: "Makotulo", author: "Z.S.Phoka", genre: "History", isbn: "978-0798127329", qty: 13 }
    ];
    save(KEYS.books, books);
  }

  var LOW_STOCK = 2;

  var toastTimer;
  function toast(message) {
    var box = $("toast");
    box.textContent = message;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.hidden = true; }, 2400);
  }

  /* ---------- App start ---------- */
  function showApp() {
    $("app").hidden = false;
    renderAll();
  }

  /* ---------- Navigation ---------- */
  var navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(function (btn) {
    btn.addEventListener("click", function () {
      navLinks.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      document.querySelectorAll(".page").forEach(function (p) { p.hidden = true; });
      $("page-" + btn.dataset.page).hidden = false;
      $("sidebar").classList.remove("open");
    });
  });
  $("menu-toggle").addEventListener("click", function () {
    $("sidebar").classList.toggle("open");
  });

  /* ---------- Dashboard ---------- */
  function renderDashboard() {
    var totalTitles = books.length;
    var totalCopies = books.reduce(function (sum, b) { return sum + b.qty; }, 0);
    var issuedOut = txns.filter(function (t) { return !t.returnDate; }).length;
    var lowStock = books.filter(function (b) { return b.qty <= LOW_STOCK; }).length;

    var stats = $("stats");
    stats.innerHTML = "";
    [
      ["Titles", totalTitles],
      ["Total copies", totalCopies],
      ["Currently issued", issuedOut],
      ["Low stock", lowStock]
    ].forEach(function (pair) {
      var card = el("div", "stat-card");
      card.appendChild(el("div", "stat-value", String(pair[1])));
      card.appendChild(el("div", "stat-label", pair[0]));
      stats.appendChild(card);
    });

    var cards = $("dashboard-cards");
    cards.innerHTML = "";
    books.forEach(function (b) {
      var card = el("div", "book-card");
      card.appendChild(el("div", "book-card-title", b.title));
      card.appendChild(el("div", "book-card-author", b.author));
      var status = el("span", "pill " + (b.qty > LOW_STOCK ? "pill-ok" : b.qty > 0 ? "pill-warn" : "pill-danger"),
        b.qty > 0 ? b.qty + " available" : "Out of stock");
      card.appendChild(status);
      cards.appendChild(card);
    });
  }

  /* ---------- Book management ---------- */
  var bookForm = $("book-form");
  var bookCancel = $("book-cancel");

  function renderBooks(filter) {
    var body = $("books-body");
    body.innerHTML = "";
    var q = (filter || "").trim().toLowerCase();
    books
      .filter(function (b) {
        if (!q) return true;
        return (b.title + " " + b.author + " " + b.isbn).toLowerCase().indexOf(q) !== -1;
      })
      .forEach(function (b) {
        var tr = document.createElement("tr");
        tr.appendChild(el("td", null, b.title));
        tr.appendChild(el("td", null, b.author));
        tr.appendChild(el("td", null, b.genre));
        tr.appendChild(el("td", null, b.isbn));
        tr.appendChild(el("td", null, String(b.qty)));

        var statusTd = document.createElement("td");
        var pill = el("span", "pill " + (b.qty > LOW_STOCK ? "pill-ok" : b.qty > 0 ? "pill-warn" : "pill-danger"),
          b.qty > 0 ? "In stock" : "Out of stock");
        statusTd.appendChild(pill);
        tr.appendChild(statusTd);

        var actionsTd = document.createElement("td");
        actionsTd.className = "actions";
        var editBtn = el("button", "btn btn-sm btn-edit", "Edit");
        editBtn.addEventListener("click", function () { startEditBook(b.id); });
        var delBtn = el("button", "btn btn-sm btn-danger", "Delete");
        delBtn.addEventListener("click", function () { deleteBook(b.id); });
        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(delBtn);
        tr.appendChild(actionsTd);

        body.appendChild(tr);
      });
  }

  function resetBookForm() {
    bookForm.reset();
    $("book-id").value = "";
    $("book-submit").textContent = "Add Book";
    bookCancel.hidden = true;
  }

  function startEditBook(id) {
    var b = books.find(function (x) { return x.id === id; });
    if (!b) return;
    $("book-id").value = b.id;
    $("book-title").value = b.title;
    $("book-author").value = b.author;
    $("book-genre").value = b.genre;
    $("book-isbn").value = b.isbn;
    $("book-qty").value = b.qty;
    $("book-submit").textContent = "Save Changes";
    bookCancel.hidden = false;
  }

  function deleteBook(id) {
    if (!window.confirm("Delete this book?")) return;
    books = books.filter(function (b) { return b.id !== id; });
    save(KEYS.books, books);
    toast("Book deleted.");
    renderAll();
  }

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var id = $("book-id").value;
    var data = {
      title: $("book-title").value.trim(),
      author: $("book-author").value.trim(),
      genre: $("book-genre").value,
      isbn: $("book-isbn").value.trim(),
      qty: parseInt($("book-qty").value, 10) || 0
    };
    if (id) {
      var b = books.find(function (x) { return x.id === id; });
      Object.assign(b, data);
      toast("Book updated.");
    } else {
      data.id = uid();
      books.push(data);
      toast("Book added.");
    }
    save(KEYS.books, books);
    resetBookForm();
    renderAll();
  });

  bookCancel.addEventListener("click", resetBookForm);

  $("book-search").addEventListener("input", function () {
    renderBooks(this.value);
  });

  /* ---------- Transactions ---------- */
  var issueForm = $("issue-form");

  function populateTxnSelects() {
    var bookSel = $("txn-book");
    bookSel.innerHTML = "";
    books
      .filter(function (b) { return b.qty > 0; })
      .forEach(function (b) {
        var opt = el("option", null, b.title + " (" + b.qty + " left)");
        opt.value = b.id;
        bookSel.appendChild(opt);
      });

    var userSel = $("txn-user");
    userSel.innerHTML = "";
    users.forEach(function (u) {
      var opt = el("option", null, u.name + " (" + u.memberId + ")");
      opt.value = u.id;
      userSel.appendChild(opt);
    });
  }

  function renderTxns() {
    var body = $("txns-body");
    body.innerHTML = "";
    txns
      .slice()
      .reverse()
      .forEach(function (t) {
        var book = books.find(function (b) { return b.id === t.bookId; });
        var user = users.find(function (u) { return u.id === t.userId; });
        var tr = document.createElement("tr");
        tr.appendChild(el("td", null, book ? book.title : "(deleted book)"));
        tr.appendChild(el("td", null, user ? user.name : "(deleted user)"));
        tr.appendChild(el("td", null, t.issueDate));
        tr.appendChild(el("td", null, t.dueDate));
        tr.appendChild(el("td", null, t.returnDate || "-"));

        var statusTd = document.createElement("td");
        var overdue = !t.returnDate && t.dueDate < todayStr();
        var pill = el("span", "pill " + (t.returnDate ? "pill-ok" : overdue ? "pill-danger" : "pill-warn"),
          t.returnDate ? "Returned" : overdue ? "Overdue" : "Issued");
        statusTd.appendChild(pill);
        tr.appendChild(statusTd);

        var actionsTd = document.createElement("td");
        actionsTd.className = "actions";
        if (!t.returnDate) {
          var retBtn = el("button", "btn btn-sm btn-primary", "Return");
          retBtn.addEventListener("click", function () { returnBook(t.id); });
          actionsTd.appendChild(retBtn);
        }
        tr.appendChild(actionsTd);

        body.appendChild(tr);
      });
  }

  function returnBook(txnId) {
    var t = txns.find(function (x) { return x.id === txnId; });
    if (!t || t.returnDate) return;
    t.returnDate = todayStr();
    var book = books.find(function (b) { return b.id === t.bookId; });
    if (book) book.qty += 1;
    save(KEYS.txns, txns);
    save(KEYS.books, books);
    toast("Book returned.");
    renderAll();
  }

  issueForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var bookId = $("txn-book").value;
    var userId = $("txn-user").value;
    var due = $("txn-due").value;
    var book = books.find(function (b) { return b.id === bookId; });
    if (!book || book.qty < 1) {
      toast("That book is not available.");
      return;
    }
    if (!userId || !due) return;

    book.qty -= 1;
    txns.push({
      id: uid(),
      bookId: bookId,
      userId: userId,
      issueDate: todayStr(),
      dueDate: due,
      returnDate: null
    });
    save(KEYS.books, books);
    save(KEYS.txns, txns);
    issueForm.reset();
    toast("Book issued.");
    renderAll();
  });

  /* ---------- User management ---------- */
  var userForm = $("user-form");
  var userCancel = $("user-cancel");

  function renderUsers() {
    var body = $("users-body");
    body.innerHTML = "";
    users.forEach(function (u) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, u.name));
      tr.appendChild(el("td", null, u.memberId));
      tr.appendChild(el("td", null, u.role));

      var actionsTd = document.createElement("td");
      actionsTd.className = "actions";
      var editBtn = el("button", "btn btn-sm btn-edit", "Edit");
      editBtn.addEventListener("click", function () { startEditUser(u.id); });
      var delBtn = el("button", "btn btn-sm btn-danger", "Delete");
      delBtn.addEventListener("click", function () { deleteUser(u.id); });
      actionsTd.appendChild(editBtn);
      actionsTd.appendChild(delBtn);
      tr.appendChild(actionsTd);

      body.appendChild(tr);
    });
  }

  function resetUserForm() {
    userForm.reset();
    $("user-id").value = "";
    $("user-submit").textContent = "Add User";
    userCancel.hidden = true;
  }

  function startEditUser(id) {
    var u = users.find(function (x) { return x.id === id; });
    if (!u) return;
    $("user-id").value = u.id;
    $("user-name").value = u.name;
    $("user-memberid").value = u.memberId;
    $("user-role").value = u.role;
    $("user-submit").textContent = "Save Changes";
    userCancel.hidden = false;
  }

  function deleteUser(id) {
    if (session && session.id === id) {
      toast("You can't delete the account you're logged in as.");
      return;
    }
    if (!window.confirm("Delete this user?")) return;
    users = users.filter(function (u) { return u.id !== id; });
    save(KEYS.users, users);
    toast("User deleted.");
    renderAll();
  }

  userForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var id = $("user-id").value;
    var data = {
      name: $("user-name").value.trim(),
      memberId: $("user-memberid").value.trim().toUpperCase(),
      role: $("user-role").value
    };
    var duplicate = users.some(function (u) {
      return u.memberId.toUpperCase() === data.memberId && u.id !== id;
    });
    if (duplicate) {
      toast("That membership ID is already in use.");
      return;
    }
    if (id) {
      var u = users.find(function (x) { return x.id === id; });
      Object.assign(u, data);
      toast("User updated.");
    } else {
      data.id = uid();
      users.push(data);
      toast("User added.");
    }
    save(KEYS.users, users);
    resetUserForm();
    renderAll();
  });

  userCancel.addEventListener("click", resetUserForm);

  /* ---------- Render everything ---------- */
  function renderAll() {
    renderDashboard();
    renderBooks($("book-search") ? $("book-search").value : "");
    populateTxnSelects();
    renderTxns();
    renderUsers();
  }

  /* ================================================================
     ADDITIONS (individual assignment requirements)
     Everything above is untouched; the code below only adds to it.
     ================================================================ */

  var STOCK_KEY = "lib_stock";
  var stockLog = load(STOCK_KEY, []);

  /* ---------- Repair stale / foreign localStorage data ---------- */
  /* Other projects on localhost share localStorage; reset any list that is not in the shape this app needs. */
  var usersOk = Array.isArray(users) && users.every(function (u) {
    return u && u.id && typeof u.name === "string" && typeof u.memberId === "string" && typeof u.role === "string";
  });
  if (!usersOk) {
    users = [
      { id: uid(), name: "Bokhabane", memberId: "901020604", role: "admin" },
      { id: uid(), name: "Millie", memberId: "59700294", role: "librarian" }
    ];
    save(KEYS.users, users);
  }
  var booksOk = Array.isArray(books) && books.every(function (b) {
    return b && b.id && typeof b.title === "string" && typeof b.author === "string" &&
      typeof b.genre === "string" && typeof b.isbn === "string" && typeof b.qty === "number";
  });
  if (!booksOk) {
    books = [
      { id: uid(), title: "Mosali a nkhola", author: "M.S.Phafoli", genre: "Drama", isbn: "978-0798141235", qty: 10 },
      { id: uid(), title: "Meokho ea thabo", author: "S.M.Mofokeng", genre: "Romance", isbn: "978-0798103059", qty: 5 },
      { id: uid(), title: "Makotulo", author: "Z.S.Phoka", genre: "History", isbn: "978-0798127329", qty: 13 }
    ];
    save(KEYS.books, books);
  }
  if (!Array.isArray(txns)) { txns = []; save(KEYS.txns, txns); }
  if (!Array.isArray(stockLog)) { stockLog = []; save(STOCK_KEY, stockLog); }

  /* ---------- Low-stock alert (Dashboard) ---------- */
  var lowStockAlert = ce("div", { id: "low-stock-alert", class: "alert alert-warn", hidden: "" });
  $("page-dashboard").insertBefore(lowStockAlert, $("stats"));

  /* ---------- Stock adjustments: add / deduct stock + history log ---------- */
  var stockPage = $("page-transactions");
  var stockTxnsPanel = stockPage.lastElementChild;

  stockPage.insertBefore(ce("h3", { class: "section-title" }, "Stock adjustments"), stockTxnsPanel);

  var stockForm = ce("form", { id: "stock-form", class: "panel form-grid", autocomplete: "off" });
  stockForm.appendChild(field("Book", ce("select", { id: "stock-book", required: "" })));

  var stockActionSel = ce("select", { id: "stock-action", required: "" });
  [["add", "Add stock (new arrivals)"], ["deduct", "Deduct stock"]].forEach(function (o) {
    stockActionSel.appendChild(ce("option", { value: o[0] }, o[1]));
  });
  stockForm.appendChild(field("Action", stockActionSel));
  stockForm.appendChild(field("Quantity", ce("input", { type: "number", id: "stock-qty", min: "1", value: "1", required: "" })));
  stockForm.appendChild(field("Note", ce("input", { type: "text", id: "stock-note", placeholder: "e.g. Donation, damaged copy" })));

  var stockActions = ce("div", { class: "form-actions" });
  stockActions.appendChild(ce("button", { type: "submit", class: "btn btn-primary" }, "Record Stock"));
  stockForm.appendChild(stockActions);
  stockPage.insertBefore(stockForm, stockTxnsPanel);

  var stockPanel = ce("div", { class: "panel" });
  stockPanel.appendChild(ce("h3", { class: "section-title" }, "Stock history log"));
  var stockWrap = ce("div", { class: "table-wrap" });
  var stockTable = ce("table", { class: "table" });
  var stockThead = ce("thead");
  var stockHeadRow = ce("tr");
  ["Date", "Book", "Action", "Qty", "Stock (before → after)", "Note", "By"].forEach(function (h) {
    stockHeadRow.appendChild(ce("th", null, h));
  });
  stockThead.appendChild(stockHeadRow);
  stockTable.appendChild(stockThead);
  stockTable.appendChild(ce("tbody", { id: "stock-body" }));
  stockWrap.appendChild(stockTable);
  stockPanel.appendChild(stockWrap);
  stockPage.appendChild(stockPanel);

  function populateStockSelect() {
    var sel = $("stock-book");
    var previous = sel.value;
    sel.innerHTML = "";
    books.forEach(function (b) {
      var opt = el("option", null, b.title + " (" + b.qty + " in stock)");
      opt.value = b.id;
      sel.appendChild(opt);
    });
    if (previous) sel.value = previous;
  }

  function renderStockLog() {
    var body = $("stock-body");
    body.innerHTML = "";
    stockLog.slice().reverse().forEach(function (s) {
      var tr = document.createElement("tr");
      tr.appendChild(el("td", null, s.date));
      tr.appendChild(el("td", null, s.title));

      var actionTd = document.createElement("td");
      actionTd.appendChild(el("span", "pill " + (s.action === "add" ? "pill-add" : "pill-deduct"),
        s.action === "add" ? "Added" : "Deducted"));
      tr.appendChild(actionTd);

      tr.appendChild(el("td", null, String(s.qty)));
      tr.appendChild(el("td", null, s.before + " → " + s.after));
      tr.appendChild(el("td", null, s.note || "-"));
      tr.appendChild(el("td", null, s.by));
      body.appendChild(tr);
    });
  }

  stockForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var book = books.find(function (b) { return b.id === $("stock-book").value; });
    var action = $("stock-action").value;
    var qty = parseInt($("stock-qty").value, 10);

    if (!book) { toast("Please select a book."); return; }
    if (!qty || qty < 1) { toast("Quantity must be at least 1."); return; }
    if (action === "deduct" && qty > book.qty) {
      toast("Cannot deduct " + qty + " - only " + book.qty + " in stock.");
      return;
    }

    var before = book.qty;
    book.qty = action === "add" ? before + qty : before - qty;
    stockLog.push({
      id: uid(),
      bookId: book.id,
      title: book.title,
      action: action,
      qty: qty,
      before: before,
      after: book.qty,
      note: $("stock-note").value.trim(),
      date: todayStr(),
      by: session ? session.name : "-"
    });
    save(KEYS.books, books);
    save(STOCK_KEY, stockLog);
    stockForm.reset();
    toast(action === "add" ? "Stock added." : "Stock deducted.");
    renderAll();
  });

  /* ---------- Low-stock highlighting (Dashboard cards + Books table) ---------- */
  function renderLowStock() {
    var cards = $("dashboard-cards").children;
    books.forEach(function (b, i) {
      if (cards[i] && b.qty <= LOW_STOCK) cards[i].classList.add("low-stock");
    });

    Array.prototype.forEach.call($("books-body").children, function (tr) {
      var isbn = tr.children[3] ? tr.children[3].textContent : "";
      var b = books.find(function (x) { return x.isbn === isbn; });
      if (b && b.qty <= LOW_STOCK) tr.classList.add("low-stock");
    });

    var low = books.filter(function (b) { return b.qty <= LOW_STOCK; });
    if (low.length) {
      lowStockAlert.textContent = "Low stock: " + low.map(function (b) {
        return b.title + " (" + b.qty + ")";
      }).join(", ");
      lowStockAlert.hidden = false;
    } else {
      lowStockAlert.hidden = true;
    }
  }

  /* ---------- Login (inside User Management) + role-based access ---------- */
  var ACCESS = {
    admin: ["dashboard", "books", "transactions", "users"],
    librarian: ["dashboard", "transactions"],
    member: ["dashboard"]
  };

  var usersPage = $("page-users");

  var loginPanel = ce("div", { id: "login-panel", class: "panel" });
  loginPanel.appendChild(ce("h3", { class: "section-title" }, "Login"));
  var loginForm = ce("form", { id: "login-form", class: "form-grid", autocomplete: "off" });
  loginForm.appendChild(field("Membership ID", ce("input", { type: "text", id: "login-memberid", required: "" })));
  loginForm.appendChild(field("Name", ce("input", { type: "text", id: "login-name", required: "" })));
  var loginActions = ce("div", { class: "form-actions" });
  loginActions.appendChild(ce("button", { type: "submit", class: "btn btn-primary" }, "Login"));
  loginForm.appendChild(loginActions);
  loginPanel.appendChild(loginForm);
  loginPanel.appendChild(ce("p", { class: "hint" }, "Demo admin - ID: 901020604, Name: Bokhabane | Demo librarian - ID: 59700294, Name: Millie"));
  usersPage.insertBefore(loginPanel, usersPage.children[1]);

  var accountPanel = ce("div", { id: "account-panel", class: "panel panel-head" });
  var accountText = ce("span", { id: "account-text" });
  accountPanel.appendChild(accountText);
  var accountLogout = ce("button", { type: "button", class: "btn btn-ghost btn-sm" }, "Logout");
  accountPanel.appendChild(accountLogout);
  usersPage.insertBefore(accountPanel, usersPage.children[1]);

  var topLogout = ce("button", { type: "button", class: "btn btn-ghost btn-sm", hidden: "" }, "Logout");
  $("current-user").parentNode.appendChild(topLogout);

  function goToPage(name) {
    document.querySelector('.nav-link[data-page="' + name + '"]').click();
  }

  function signOut() {
    session = null;
    localStorage.removeItem(KEYS.session);
    toast("Logged out.");
    renderAll();
  }
  accountLogout.addEventListener("click", signOut);
  topLogout.addEventListener("click", signOut);

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var memberId = $("login-memberid").value.trim().toUpperCase();
    var name = $("login-name").value.trim().toLowerCase();
    var user = users.find(function (u) {
      return u.memberId.toUpperCase() === memberId && u.name.toLowerCase() === name;
    });
    if (!user) {
      toast("Invalid Membership ID or name.");
      return;
    }
    session = { id: user.id, name: user.name, role: user.role };
    save(KEYS.session, session);
    loginForm.reset();
    toast("Welcome, " + user.name + ".");
    renderAll();
    goToPage("dashboard");
  });

  /* Keeps the signed-in user in step with the users list (e.g. admin changes a role). */
  function syncSession() {
    if (!session) return;
    var u = users.find(function (x) { return x.id === session.id; });
    if (!u) {
      session = null;
      localStorage.removeItem(KEYS.session);
      return;
    }
    session = { id: u.id, name: u.name, role: u.role };
    save(KEYS.session, session);
  }

  function applyRoleAccess() {
    syncSession();
    var role = session ? session.role : null;
    var allowed = role ? (ACCESS[role] || ["dashboard"]) : ["users"];

    navLinks.forEach(function (btn) {
      btn.hidden = allowed.indexOf(btn.dataset.page) === -1;
    });
    var active = document.querySelector(".nav-link.active");
    if (!active || active.hidden) goToPage(allowed[0]);

    var isAdmin = role === "admin";
    loginPanel.hidden = !!session;
    accountPanel.hidden = !session;
    topLogout.hidden = !session;
    $("user-form").hidden = !isAdmin;
    $("users-body").closest(".panel").hidden = !isAdmin;

    $("current-user").textContent = session ? session.name + " (" + session.role + ")" : "Not logged in";
    accountText.textContent = session ? "Logged in as " + session.name + " (" + session.role + ")" : "";
  }

  /* ---------- Form validation (runs before the existing submit handlers) ---------- */
  $("page-books").addEventListener("submit", function (event) {
    if (event.target !== bookForm) return;
    var id = $("book-id").value;
    var isbnRaw = $("book-isbn").value.trim();
    var isbnClean = isbnRaw.replace(/[-\s]/g, "");
    var qty = Number($("book-qty").value);
    var problem = "";

    if ($("book-title").value.trim().length < 2) problem = "Title must be at least 2 characters.";
    else if ($("book-author").value.trim().length < 2) problem = "Author must be at least 2 characters.";
    else if (!/^(\d{9}[\dXx]|\d{13})$/.test(isbnClean)) problem = "ISBN must be 10 or 13 digits (hyphens allowed).";
    else if (!(qty >= 0) || Math.floor(qty) !== qty) problem = "Quantity must be a whole number, 0 or more.";
    else if (books.some(function (b) { return b.isbn.replace(/[-\s]/g, "") === isbnClean && b.id !== id; })) {
      problem = "A book with that ISBN already exists.";
    }

    if (problem) {
      event.preventDefault();
      event.stopPropagation();
      toast(problem);
    }
  }, true);

  $("page-users").addEventListener("submit", function (event) {
    if (event.target !== userForm) return;
    var problem = "";
    if ($("user-name").value.trim().length < 2) problem = "Name must be at least 2 characters.";
    else if (!/^[A-Za-z0-9]{3,}$/.test($("user-memberid").value.trim())) {
      problem = "Membership ID must be at least 3 letters/numbers (no spaces).";
    }
    if (problem) {
      event.preventDefault();
      event.stopPropagation();
      toast(problem);
    }
  }, true);

  /* ---------- Hook the new renders into the existing renderAll ---------- */
  var baseRenderAll = renderAll;
  // eslint-disable-next-line no-func-assign
  renderAll = function () {
    baseRenderAll();
    populateStockSelect();
    renderStockLog();
    renderLowStock();
    applyRoleAccess();
  };

  /* ---------- Init ---------- */
  showApp();
})();

// React needs a default export; the library UI above builds itself into the page.
export default function App() {
  return null;
}