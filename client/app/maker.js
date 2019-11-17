const handleDomo = (e, csrf) => {
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

const handleEdit = (oldName, e, csrf) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#newName").val() == '' || $("#newURL").val() == '') {

        handleError("RAWR! All fields are required");
        return false;
    }

    let params = $("#editForm").serialize() + `&oldName=${oldName}`;

    sendAjax('POST', $("#editForm").attr("action"), params, function () {
        loadLinksFromServer(csrf);
    });

    return false;
};

const handlePassword = (e) => {
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

const PasswordWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handlePassword}
            action="/password"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="original">Current Password: </label>
            <input id="original" type="password" name="original" placeholder="password" />
            <label htmlFor="new">New Password: </label>
            <input id="new" type="password" name="new" placeholder="new password" />
            <label htmlFor="confirm">Confirm New Password: </label>
            <input id="confirm" type="password" name="confirm" placeholder="retype new password" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign up" />

        </form>
    );
};

const createPasswordWindow = (csrf) => {
    ReactDOM.render(
        <PasswordWindow csrf={csrf} />,
        document.querySelector("#domos")
    );
};

const Editor = (props) => {
    return (
        <div>
            <img src="/assets/img/face.png" onClick={() => { setup(props.csrf) }}></img>

            <form id="editForm"
                onSubmit={(e) => { handleEdit(props.domo.name, e, props.csrf) }}
                name="domoForm"
                action="/edit"
                method="POST"
            >
                <label htmlFor="name">newname: </label>
                <input id="newName" type="text" name="name" defaultValue={props.domo.name} />
                <label htmlFor="url">url: </label>
                <input id="newURL" type="text" name="url" defaultValue={props.domo.url} />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeDomoSubmit" type="submit" value="add link" />

            </form>
        </div>
    );
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => { handleDomo(e, props.csrf) }}
            name="domoForm"
            action="/main"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">name: </label>
            <input id="domoName" type="text" name="name" placeholder="url" />
            <label htmlFor="url">url: </label>
            <input id="domoUrl" type="text" name="url" placeholder="url" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="add link" />

        </form>
    )
}

const LinkList = function (props) {
    if (props.links.length === 0) {
        return (
            <div className="LinkList">
                <h3 className="emptyDomo">no links yet</h3>
            </div>
        );
    }


    const domoNodes = props.links.map(function (domo) {
        return (
            <div className="linkBar">
                <div className="favicon"><img src={domo.icon} className="icon"></img></div>
                <a href={domo.url} className="link" target="_blank">
                    <div key={domo._id} >
                        <h3 className="linkName">{domo.name} </h3>
                    </div>
                </a>
                <div className="edit" onClick={() => { openEditor(domo, props.csrf) }} ></div>
                <div className="remove" onClick={() => { removeLink(domo.name, props.csrf) }}></div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadLinksFromServer = (csrf) => {
    sendAjax('GET', '/getLinks', null, (data) => {
        ReactDOM.render(
            <LinkList links={data.domos} csrf={csrf} />, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {

    const passwordButton = document.querySelector("#passwordButton");

    passwordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <LinkList links={[]} csrf={csrf} />, document.querySelector("#domos")
    );

    loadLinksFromServer(csrf);
}

const openEditor = (domo, csrf) => {
    ReactDOM.render(
        <Editor domo={domo} csrf={csrf} />, document.querySelector("#domos")
    );
};

const removeLink = (name, csrf) => {
    sendAjax('POST', `/removeLink?_csrf=${csrf}`, { name: name }, (data) => {
        loadLinksFromServer(csrf);
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
