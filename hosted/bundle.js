"use strict";

var handleDomo = function handleDomo(e, csrf) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoUrl").val() == '') {

        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadLinksFromServer(csrf);
    });

    return false;
};

var handleEdit = function handleEdit(oldName, e, csrf) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

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

    $("#domoMessage").animate({ width: 'hide' }, 350);

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
    ReactDOM.render(React.createElement(PasswordWindow, { csrf: csrf }), document.querySelector("#domos"));
};

var Editor = function Editor(props) {
    return React.createElement(
        "div",
        null,
        React.createElement("img", { src: "/assets/img/face.png", onClick: function onClick() {
                setup(props.csrf);
            } }),
        React.createElement(
            "form",
            { id: "editForm",
                onSubmit: function onSubmit(e) {
                    handleEdit(props.domo.name, e, props.csrf);
                },
                name: "domoForm",
                action: "/edit",
                method: "POST"
            },
            React.createElement(
                "label",
                { htmlFor: "name" },
                "newname: "
            ),
            React.createElement("input", { id: "newName", type: "text", name: "name", defaultValue: props.domo.name }),
            React.createElement(
                "label",
                { htmlFor: "url" },
                "url: "
            ),
            React.createElement("input", { id: "newURL", type: "text", name: "url", defaultValue: props.domo.url }),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "add link" })
        )
    );
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: function onSubmit(e) {
                handleDomo(e, props.csrf);
            },
            name: "domoForm",
            action: "/main",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "url" }),
        React.createElement(
            "label",
            { htmlFor: "url" },
            "url: "
        ),
        React.createElement("input", { id: "domoUrl", type: "text", name: "url", placeholder: "url" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "add link" })
    );
};

var LinkList = function LinkList(props) {
    if (props.links.length === 0) {
        return React.createElement(
            "div",
            { className: "LinkList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "no links yet"
            )
        );
    }

    var domoNodes = props.links.map(function (domo) {
        return React.createElement(
            "div",
            { className: "linkBar" },
            React.createElement(
                "div",
                { className: "favicon" },
                React.createElement("img", { src: domo.icon, className: "icon" })
            ),
            React.createElement(
                "a",
                { href: domo.url, className: "link", target: "_blank" },
                React.createElement(
                    "div",
                    { key: domo._id },
                    React.createElement(
                        "h3",
                        { className: "linkName" },
                        domo.name,
                        " "
                    )
                )
            ),
            React.createElement("div", { className: "edit", onClick: function onClick() {
                    openEditor(domo, props.csrf);
                } }),
            React.createElement("div", { className: "remove", onClick: function onClick() {
                    removeLink(domo.name, props.csrf);
                } })
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadLinksFromServer = function loadLinksFromServer(csrf) {
    sendAjax('GET', '/getLinks', null, function (data) {
        ReactDOM.render(React.createElement(LinkList, { links: data.domos, csrf: csrf }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {

    var passwordButton = document.querySelector("#passwordButton");

    passwordButton.addEventListener("click", function (e) {
        e.preventDefault();
        createPasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(LinkList, { links: [], csrf: csrf }), document.querySelector("#domos"));

    loadLinksFromServer(csrf);
};

var openEditor = function openEditor(domo, csrf) {
    ReactDOM.render(React.createElement(Editor, { domo: domo, csrf: csrf }), document.querySelector("#domos"));
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
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
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
