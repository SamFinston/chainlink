"use strict";

var handleLink = function handleLink(e, csrf) {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#linkName").val() == '' || $("#linkUrl").val() == '') {

        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#linkForm").attr("action"), $("#linkForm").serialize(), function () {
        loadLinksFromServer(csrf);
    });

    return false;
};

var handleEdit = function handleEdit(oldName, e, csrf) {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#newName").val() == '' || $("#newURL").val() == '') {

        handleError("RAWR! All fields are required");
        return false;
    }

    var params = $("#editForm").serialize() + ("&oldName=" + oldName);

    sendAjax('POST', $("#editForm").attr("action"), params, function () {
        loadLinksFromServer(csrf);
    });

    return false;
};

var handlePassword = function handlePassword(e) {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#original").val() == '' || $("#new").val() == '' || $("#confirm").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }

    if ($("#new").val() !== $("#confirm").val()) {
        handleError("RAWR! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
};

var PasswordWindow = function PasswordWindow(props) {
    return React.createElement(
        "form",
        { id: "signupForm",
            name: "signupForm",
            onSubmit: handlePassword,
            action: "/password",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "label",
            { htmlFor: "original" },
            "Current Password: "
        ),
        React.createElement("input", { id: "original", type: "password", name: "original", placeholder: "password" }),
        React.createElement(
            "label",
            { htmlFor: "new" },
            "New Password: "
        ),
        React.createElement("input", { id: "new", type: "password", name: "new", placeholder: "new password" }),
        React.createElement(
            "label",
            { htmlFor: "confirm" },
            "Confirm New Password: "
        ),
        React.createElement("input", { id: "confirm", type: "password", name: "confirm", placeholder: "retype new password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "Sign up" })
    );
};

var createPasswordWindow = function createPasswordWindow(csrf) {
    ReactDOM.render(React.createElement(PasswordWindow, { csrf: csrf }), document.querySelector("#links"));
};

var Editor = function Editor(props) {
    return React.createElement(
        "div",
        null,
        React.createElement("img", { src: "assets/img/ricon.ico", onClick: function onClick() {
                setup(props.csrf);
            } }),
        React.createElement(
            "form",
            { id: "editForm",
                onSubmit: function onSubmit(e) {
                    handleEdit(props.link.name, e, props.csrf);
                },
                name: "editForm",
                action: "/edit",
                method: "POST"
            },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "newname: "
            ),
            React.createElement("input", { id: "newName", type: "text", name: "name", defaultValue: props.link.name }),
            React.createElement(
                "label",
                { htmlFor: "url" },
                "url: "
            ),
            React.createElement("input", { id: "newURL", type: "text", name: "url", defaultValue: props.link.url }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "makeLinkSubmit", type: "submit", value: "add link" })
        )
    );
};

var LinkForm = function LinkForm(props) {
    return React.createElement(
        "form",
        { id: "linkForm",
            onSubmit: function onSubmit(e) {
                handleLink(e, props.csrf);
            },
            name: "linkForm",
            action: "/main",
            method: "POST",
            className: "linkForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "name: "
        ),
        React.createElement("input", { id: "linkName", type: "text", name: "name", placeholder: "Bookmark Title" }),
        React.createElement(
            "label",
            { htmlFor: "url" },
            "url: "
        ),
        React.createElement("input", { id: "linkUrl", type: "text", name: "url", placeholder: "http://www.address.com" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeLinkSubmit", type: "submit", value: "add link" })
    );
};

var LinkList = function LinkList(props) {
    if (props.links.length === 0) {
        return React.createElement(
            "div",
            { className: "LinkList" },
            React.createElement(
                "h3",
                { className: "emptyLink" },
                "no links yet"
            )
        );
    }

    var linkNodes = props.links.map(function (link) {
        return React.createElement(
            "div",
            { className: "linkBar" },
            React.createElement(
                "div",
                { className: "favicon" },
                React.createElement("img", { src: link.icon, className: "icon" })
            ),
            React.createElement(
                "a",
                { href: link.url, className: "click", target: "_blank" },
                React.createElement(
                    "div",
                    { key: link._id },
                    React.createElement(
                        "h3",
                        { className: "linkName" },
                        link.name,
                        " "
                    )
                )
            ),
            React.createElement("div", { className: "edit", onClick: function onClick() {
                    openEditor(link, props.csrf);
                } }),
            React.createElement("div", { className: "remove", onClick: function onClick() {
                    removeLink(link.name, props.csrf);
                } })
        );
    });

    return React.createElement(
        "div",
        { className: "linkList" },
        linkNodes
    );
};

var loadLinksFromServer = function loadLinksFromServer(csrf) {
    sendAjax('GET', '/getLinks', null, function (data) {
        ReactDOM.render(React.createElement(LinkList, { links: data.links, csrf: csrf }), document.querySelector("#links"));
    });
};

var setup = function setup(csrf) {

    var passwordButton = document.querySelector("#passwordButton");

    passwordButton.addEventListener("click", function (e) {
        e.preventDefault();
        createPasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(React.createElement(LinkForm, { csrf: csrf }), document.querySelector("#makeLink"));

    ReactDOM.render(React.createElement(LinkList, { links: [], csrf: csrf }), document.querySelector("#links"));

    loadLinksFromServer(csrf);
};

var openEditor = function openEditor(link, csrf) {
    ReactDOM.render(React.createElement(Editor, { link: link, csrf: csrf }), document.querySelector("#links"));
};

var removeLink = function removeLink(name, csrf) {
    sendAjax('POST', "/removeLink?_csrf=" + csrf, { name: name }, function (data) {
        loadLinksFromServer(csrf);
    });
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#linkMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#linkMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
