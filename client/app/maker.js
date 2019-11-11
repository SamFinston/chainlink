const handleDomo = (e, csrf) => {
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

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => {handleDomo(e, props.csrf)}}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="talent">url: </label>
            <input id="domoTalent" type="text" name="talent" placeholder="Domo Talent" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="add link" />

        </form>
    )
}

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">no links yet</h3>
            </div>
        );
    }


    const domoNodes = props.domos.map(function (domo) {
        return (
            <div className="linkBar">
                <div className="favicon"><img src="/assets/img/ricon.ico" className="icon"></img></div>
                <a href={domo.talent} className="link">
                    <div key={domo._id} >
                        <h3 className="linkName">{domo.name} </h3>
                    </div>
                </a>
                <div className="edit" ></div>
                <div className="remove" onClick={() => {removeDomo(domo.name, props.csrf)} }></div>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrf} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} csrf={csrf} />, document.querySelector("#domos")
    );

    loadDomosFromServer(csrf);
}

const ageDomo = (name, csrf) => {
    sendAjax('POST', `/ageDomo?_csrf=${csrf}`, {name: name}, (data) => {
        loadDomosFromServer(csrf);
    });
};

const removeDomo = (name, csrf) => {
    sendAjax('POST', `/removeDomo?_csrf=${csrf}`, {name: name}, (data) => {
        loadDomosFromServer(csrf);
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
