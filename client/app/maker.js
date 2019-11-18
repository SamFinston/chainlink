const handleLink = (e, csrf) => {
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

const handleEdit = (oldName, e, csrf) => {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

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
        document.querySelector("#links")
    );
};

const Editor = (props) => {
    return (
        <div>
            <img src="assets/img/ricon.ico" onClick={() => { setup(props.csrf) }}></img>

            <form id="editForm"
                onSubmit={(e) => { handleEdit(props.link.name, e, props.csrf) }}
                name="editForm"
                action="/edit"
                method="POST"
            >
                <label htmlFor="name">newname: </label>
                <input id="newName" type="text" name="name" defaultValue={props.link.name} />
                <label htmlFor="url">url: </label>
                <input id="newURL" type="text" name="url" defaultValue={props.link.url} />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input className="makeLinkSubmit" type="submit" value="add link" />

            </form>
        </div>
    );
};

const LinkForm = (props) => {
    return (
        <form id="linkForm"
            onSubmit={(e) => { handleLink(e, props.csrf) }}
            name="linkForm"
            action="/main"
            method="POST"
            className="linkForm"
        >
            <label htmlFor="name">name: </label>
            <input id="linkName" type="text" name="name" placeholder="Bookmark Title" />
            <label htmlFor="url">url: </label>
            <input id="linkUrl" type="text" name="url" placeholder="http://www.address.com" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeLinkSubmit" type="submit" value="add link" />

        </form>
    )
}

const LinkList = function (props) {
    if (props.links.length === 0) {
        return (
            <div className="LinkList">
                <h3 className="emptyLink">no links yet</h3>
            </div>
        );
    }


    const linkNodes = props.links.map(function (link) {
        return (
            <div className="linkBar">
                <div className="favicon"><img src={link.icon} className="icon"></img></div>
                <a href={link.url} className="click" target="_blank">
                    <div key={link._id} >
                        <h3 className="linkName">{link.name} </h3>
                    </div>
                </a>
                <div className="edit" onClick={() => { openEditor(link, props.csrf) }} ></div>
                <div className="remove" onClick={() => { removeLink(link.name, props.csrf) }}></div>
            </div>
        );
    });

    return (
        <div className="linkList">
            {linkNodes}
        </div>
    );
};

const loadLinksFromServer = (csrf) => {
    sendAjax('GET', '/getLinks', null, (data) => {
        ReactDOM.render(
            <LinkList links={data.links} csrf={csrf} />, document.querySelector("#links")
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
        <LinkForm csrf={csrf} />, document.querySelector("#makeLink")
    );

    ReactDOM.render(
        <LinkList links={[]} csrf={csrf} />, document.querySelector("#links")
    );

    loadLinksFromServer(csrf);
}

const openEditor = (link, csrf) => {
    ReactDOM.render(
        <Editor link={link} csrf={csrf} />, document.querySelector("#links")
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
