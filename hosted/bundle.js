"use strict";

var handleDomo = function handleDomo(e, csrf) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoTalent").val() == '') {

        handleError("RAWR! All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer(csrf);
    });

    return false;
};

var DomoForm = function DomoForm(props) {
    return React.createElement(
        "form",
        { id: "domoForm",
            onSubmit: function onSubmit(e) {
                handleDomo(e, props.csrf);
            },
            name: "domoForm",
            action: "/maker",
            method: "POST",
            className: "domoForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "name: "
        ),
        React.createElement("input", { id: "domoName", type: "text", name: "name", placeholder: "Domo Name" }),
        React.createElement(
            "label",
            { htmlFor: "talent" },
            "url: "
        ),
        React.createElement("input", { id: "domoTalent", type: "text", name: "talent", placeholder: "Domo Talent" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "add link" })
    );
};

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            "div",
            { className: "domoList" },
            React.createElement(
                "h3",
                { className: "emptyDomo" },
                "no links yet"
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
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
                { href: domo.talent, className: "link" },
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
            React.createElement("div", { className: "edit" }),
            React.createElement("div", { className: "remove", onClick: function onClick() {
                    removeDomo(domo.name, props.csrf);
                } })
        );
    });

    return React.createElement(
        "div",
        { className: "domoList" },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domos"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

    ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domos"));

    loadDomosFromServer(csrf);
};

var ageDomo = function ageDomo(name, csrf) {
    sendAjax('POST', "/ageDomo?_csrf=" + csrf, { name: name }, function (data) {
        loadDomosFromServer(csrf);
    });
};

var removeDomo = function removeDomo(name, csrf) {
    sendAjax('POST', "/removeDomo?_csrf=" + csrf, { name: name }, function (data) {
        loadDomosFromServer(csrf);
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
