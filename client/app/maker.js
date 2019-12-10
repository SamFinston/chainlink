let privateMode = false;
let numBookmarks = 0;

const handleLink = (e, csrf) => {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#linkName").val() == '' || $("#linkUrl").val() == '') {

        handleError("Whoops! All fields are required");
        return false;
    }

    let params = $("#linkForm").serialize() + `&order=${numBookmarks + 1}`;
    console.log(params);

    sendAjax('POST', $("#linkForm").attr("action"), params, function () {
        loadLinksFromServer(csrf);
    });

    document.querySelector('#linkName').value = '';
    document.querySelector('#linkUrl').value = '';

    return false;
};

const handleEdit = (oldName, e, csrf) => {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#newName").val() == '' || $("#newURL").val() == '') {

        handleError("Whoops! All fields are required");
        return false;
    }

    let params = $("#editForm").serialize() + `&oldName=${oldName}&icon=${$("#imageSelect").val()}`;

    sendAjax('POST', $("#editForm").attr("action"), params, function () {
        loadLinksFromServer(csrf);
    });

    openLinkForm(csrf);

    return false;
};

const handlePassword = (e) => {
    e.preventDefault();

    $("#chainlinkMessage").animate({ width: 'hide' }, 350);

    if ($("#original").val() == '' || $("#new").val() == '' || $("#confirm").val() == '') {
        handleError("Whoops! All fields are required");
        return false;
    }

    if ($("#new").val() !== $("#confirm").val()) {
        handleError("Whoops! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), () => { openLinkForm($("#secret").val()) });

    return false;
};

const PasswordWindow = (props) => {
    return (
        <form id="passwordForm"
            name="signupForm"
            onSubmit={handlePassword}
            action="/password"
            method="POST"
            className="mainForm"
        >
            <h1>Change Password</h1>
            <label htmlFor="original">Current Password: </label>
            <input id="original" type="password" name="original" placeholder="password" />
            <label htmlFor="new">New Password: </label>
            <input id="new" type="password" name="new" placeholder="new password" />
            <label htmlFor="confirm">Confirm New Password: </label>
            <input id="confirm" type="password" name="confirm" placeholder="retype new password" />
            <input id="secret" type="hidden" name="_csrf" value={props.csrf} />
            <span>
                <input className="makeLinkSubmit closeEditor button" type="button" onClick={() => { openLinkForm(props.csrf) }} value="cancel" />
                <input className="makeLinkSubmit button" type="submit" value="update" />
            </span>

        </form>
    );
};

const PrivateWindow = (props) => {
    return (
        <form id="passwordForm"
            name="signupForm"
            action="/password"
            method="POST"
            className="mainForm"
        >
            <h1>Private Chain</h1>

            <p>Update to a pro account Today and make your bookmarks private!</p>
            <p>Only Five Dollars!</p>
            <p>(You can't afford NOT to buy it!)</p>

            <span>
                <input className="makeLinkSubmit closeEditor button" type="button" onClick={() => { openLinkForm(props.csrf) }} value="cancel" />
                <input className="makeLinkSubmit closeEditor button" type="button" onClick={() => { openLinkForm(props.csrf) }} value="upgrade" />
            </span>

        </form>
    );
};

const createPasswordWindow = (csrf) => {
    ReactDOM.render(
        <PasswordWindow csrf={csrf} />,
        document.querySelector("#makeLink")
    );
};

const createPrivateWindow = (csrf) => {

    privateMode = !privateMode;

    loadLinksFromServer(csrf);

    if (privateMode) {
        document.querySelector("#privateButton").textContent = "View all";

        ReactDOM.render(
            <PrivateWindow csrf={csrf} />,
            document.querySelector("#makeLink")
        );
    }
    else {
        document.querySelector("#privateButton").textContent = "View private";
        openLinkForm(csrf);
    }
};

const Editor = (props) => {

    const options = props.link.images.map(function (image, index) {
        return (
            <option value={image.src}>{index}</option>
        );
    });

    return (

        <form id="editForm"
            onSubmit={(e) => { handleEdit(props.link.name, e, props.csrf) }}
            name="editForm"
            action="/edit"
            method="POST"
        >
            <h1>Edit Link</h1>
            <span>
                <label htmlFor="name">name: </label>
                <input id="newName" type="text" name="name" defaultValue={props.link.name} />
            </span>
            <span>
                <label htmlFor="url">url: </label>
                <input id="newURL" type="text" name="url" defaultValue={props.link.url} />
            </span>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <span>
                <label htmlFor="private">private: </label>
                <input id="private" type="checkbox" name="private" defaultChecked={props.link.private} />
            </span>
            <span>
                <label htmlFor="icon">icon: </label>
                <select name="icon" id="imageSelect">
                    {options}
                </select>
            </span>
            <span>
                <input className="makeLinkSubmit closeEditor button" type="button" onClick={() => { openLinkForm(props.csrf) }} value="cancel" />
                <input className="makeLinkSubmit button" type="submit" value="save" />
            </span>
        </form>

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
            <h1>Add Link</h1>
            <span>
                <label htmlFor="name">name: </label>
                <input id="linkName" type="text" name="name" placeholder="Bookmark Title" />
            </span>
            <span>
                <label htmlFor="url">url: </label>
                <input id="linkUrl" type="text" name="url" placeholder="http://www.address.com" />
            </span>
            <span>
                <label htmlFor="private">private: </label>
                <input id="private" type="checkbox" name="private" />
            </span>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeLinkSubmit button" type="submit" value="add" />

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

    numBookmarks = props.links.length;
    console.log(numBookmarks);

    const linkNodes = props.links.map(function (link) {

        return (
            <div className="linkBar" >
                <div className="favicon"><img src={link.icon} className="icon" onClick={() => { console.log(link); }}></img></div>
                <a href={link.url} className="click" target="_blank">
                    <div key={link._id} >
                        <h3 className="linkName">{link.name} </h3>
                    </div>
                </a>
                <div className="sort">
                    <div className="up" onClick={() => { sort(link.name, true, numBookmarks, props.csrf) }}><i className="fas fa-angle-up fa-2x"></i></div>
                    <div className="down" onClick={() => { sort(link.name, false, numBookmarks, props.csrf) }}><i className="fas fa-angle-down fa-2x"></i></div>
                </div>
                <div className="edit" onClick={() => { openEditor(link, props.csrf) }} ><i className="far fa-edit fa-2x"></i></div>
                <div className="remove" onClick={() => { removeLink(link.name, props.csrf) }}><i className="far fa-times-circle fa-2x"></i></div>
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
    sendAjax('GET', `/getLinks?_csrf=${csrf}`, { private: privateMode }, (data) => {
        ReactDOM.render(
            <LinkList links={data.links} csrf={csrf} />, document.querySelector("#links")
        );
    });
};

const setup = function (csrf) {
    console.dir(numBookmarks);

    const passwordButton = document.querySelector("#passwordButton");
    const privateButton = document.querySelector("#privateButton");
    const logo = document.querySelector("#title");

    passwordButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPasswordWindow(csrf);
        return false;
    });

    privateButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPrivateWindow(csrf);
        return false;
    });

    logo.addEventListener("click", (e) => {
        e.preventDefault();
        openLinkForm(csrf);
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

const openLinkForm = (csrf) => {
    ReactDOM.render(
        <LinkForm csrf={csrf} />, document.querySelector("#makeLink")
    );
};

const openEditor = (link, csrf) => {
    ReactDOM.render(
        <Editor link={link} csrf={csrf} />, document.querySelector("#makeLink")
    );
};

const removeLink = (name, csrf) => {
    sendAjax('POST', `/removeLink?_csrf=${csrf}`, { name: name }, (data) => {
        loadLinksFromServer(csrf);
    });
};

const sort = (name, up, total, csrf) => {
    sendAjax('POST', `/sort?_csrf=${csrf}`, { name: name, up: up, total: total }, (data) => {
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
