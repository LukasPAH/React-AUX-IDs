import { useState, useEffect } from "react";
import "./App.scss";

function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [searchParam] = useState(["namespace_id", "item_id", "alias"]);
    const [filterParam, setFilterParam] = useState(["All"]);
    const [sortParam, setSortParam] = useState(["Alphabetical"]);
    const [copied, setCopied] = useState(null);
    const [stable, isStable] = useState(true);
    const [update, shouldUpdate] = useState(false);

    function updateData() {
        fetch("https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/tags.json")
            .then((response) => response.json())
            .then((data) =>
                fetch(`https://raw.githubusercontent.com/bedrock-dot-dev/docs/master/${data[gameType][0]}/${data[gameType][1]}/Addons.html`)
                    .then(function (response) {
                        // When the page is loaded convert it to text
                        return response.text();
                    })
                    .then(function (html) {
                        // Initialize the DOM parser
                        var parser = new DOMParser();

                        // Parse the text
                        var doc = parser.parseFromString(html, "text/html");

                        let tableIndex = 9
                        const a = data[gameType][1].localeCompare("1.19.80", undefined, { numeric: true, sensitivity: 'base' })
                        console.warn(a)
                        if (a !== -1) {
                            tableIndex = 10
                            console.warn("aaaaaaaa")
                        }

                        // You can now even select part of that html as you would in the regular DOM
                        // Example:
                        var docArticle = doc.getElementsByTagName("table").item(tableIndex).textContent;

                        // Formatting of text into json, then convert to JSON.
                        var json_1 = docArticle.replace("\n Name ID Aux Values \n\n", "[ { 'namespace_id': '");
                        var json_2 = json_1.replace(/\n\n\n\n/g, " }, { 'namespace_id': '");
                        console.log(json_2)
                        var json_3 = json_2.replace(/\n0 = Skeleton1 = Wither2 = Zombie3 = Steve4 = Creeper5 = Dragon\n\n\n/g, " }, { 'namespace_id': '");
                        var json_3_5 = json_3.replace(/\n0 = Skeleton1 = Wither2 = Zombie3 = Steve4 = Creeper5 = Dragon6 = Piglin\n\n\n/g, " }, { 'namespace_id': '");
                        var json_4 = json_3_5.replace(/\n\n\n/g, " } ]");
                        var json_5 = json_4.replace(/\n/g, "', 'item_id': ");
                        var json_6 = json_5.replace(/'/g, `"`);
                        var actual_json = JSON.parse(json_6);

                        var more_data = require("./data/items.json");
                        let i = 0;
                        var list = [];
                        while ((more_data[i], i < more_data.length)) {
                            let a = more_data[i].identifier;
                            var list_2 = [];
                            for (let j = 0; j < actual_json.length; j++) {
                                let b = actual_json[j].namespace_id;
                                if (a == b) {
                                    var item_list = [];
                                    for (let k = 0; k < more_data[i].data.length; k++) {
                                        let array = {
                                            namespace_id: actual_json[j].namespace_id,
                                            item_id: actual_json[j].item_id,
                                            item_data: more_data[i].data[k].data,
                                            alias: more_data[i].data[k].alias,
                                        };
                                        item_list.push(array);
                                    }
                                    actual_json.splice(j, 1);
                                    list_2 = list_2.concat(item_list);
                                }
                            }
                            list = list.concat(list_2);
                            i++;
                        }

                        console.log(actual_json.concat(list));
                        setItems(actual_json.concat(list));
                        setIsLoaded(true);
                    })
                    .catch(function (err) {
                        console.log("Failed to fetch page: ", err);
                        setIsLoaded(true);
                        setError(error);
                    })
            );
    }

    if (stable) {
        var gameType = "stable";
        console.log("stable");
    }
    if (!stable) {
        var gameType = "beta";
        console.log("beta");
    }

    if (stable && update) {
        updateData();
        shouldUpdate(false);
    }
    if (!stable && update) {
        updateData();
        shouldUpdate(false);
    }

    useEffect(() => {
        updateData();
    }, []);

    function search(items) {
        if (sortParam == "Alphabetical") {
            items.sort((a, b) => a.namespace_id.toString().localeCompare(b.namespace_id));
        } else if (sortParam == "ID (Ascending)") {
            items.sort((a, b) => a.item_id + (a.item_data ? a.item_data / 65536 : 0) - (b.item_id + (b.item_data ? b.item_data / 65536 : 0)));
        } else if (sortParam == "ID (Descending)") {
            items.sort((a, b) => b.item_id + (b.item_data ? b.item_data / 65536 : 0) - (a.item_id + (a.item_data ? a.item_data / 65536 : 0)));
        }
        return items.filter((item) => {
            if (item.item_id < 256 && filterParam == "Block") {
                try {
                    return searchParam.some((newItem) => {
                        return item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
                    });
                } catch {
                    return;
                }
            } else if (filterParam == "All") {
                try {
                    return searchParam.some((newItem) => {
                        return item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
                    });
                } catch {
                    return;
                }
            } else if (item.item_id >= 256 && filterParam == "Item (New)") {
                try {
                    return searchParam.some((newItem) => {
                        return item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
                    });
                } catch {
                    return;
                }
            }
        });
    }

    function clearCopyMessage() {
        setCopied(false);
    }

    if (error) {
        return <>{error.message}</>;
    } else if (!isLoaded) {
        return <>loading...</>;
    } else {
        return (
            <div>
                <h1 className="fixedPosition">{copied ? "Copied" : ""}</h1>
                <div className="wrapper">
                    <div className="search-wrapper">
                        <input type="search" name="search-form" id="search-form" className="search-input" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
                        <div className="select">
                            <select
                                onChange={(e) => {
                                    setSortParam(e.target.value);
                                }}
                                className="custom-select"
                            >
                                <option className="dropdown-option" value="Alphabetical">
                                    Alphabetical
                                </option>
                                <option className="dropdown-option" value="ID (Ascending)">
                                    ID (Ascending)
                                </option>
                                <option className="dropdown-option" value="ID (Descending)">
                                    ID (Descending)
                                </option>
                            </select>
                            <span className="focus"></span>
                        </div>
                        <div className="select">
                            <select
                                onChange={(e) => {
                                    if (!stable) {
                                        isStable(true);
                                        shouldUpdate(true);
                                    }
                                    if (stable) {
                                        isStable(false);
                                        shouldUpdate(true);
                                    }
                                }}
                                className="custom-select"
                            >
                                <option value="Stable">Stable</option>
                                <option value="Beta">Beta</option>
                            </select>
                            <span className="focus"></span>
                        </div>
                        <div className="select">
                            <select
                                onChange={(e) => {
                                    setFilterParam(e.target.value);
                                }}
                                className="custom-select"
                            >
                                <option className="dropdown-option" value="All">
                                    All
                                </option>
                                <option className="dropdown-option" value="Block">
                                    Blocks
                                </option>
                                <option className="dropdown-option" value="Item (New)">
                                    Items (New)
                                </option>
                                <option className="dropdown-option" value="Item (Old)">
                                    Items (Old)
                                </option>
                            </select>
                            <span className="focus"></span>
                        </div>
                    </div>
                    <ul className="card-grid">
                        {search(items).map((item) => (
                            <li>
                                <article className="card" key={item.id}>
                                    <div
                                        onClick={function name() {
                                            console.log(item.item_id * 65536 + (item.item_data ? item.item_data : 0)); /*add item.item_data when it works again in place of 0*/
                                            navigator.clipboard.writeText(item.item_id * 65536 + (item.item_data ? item.item_data : 0));
                                            if (!copied) {
                                                setTimeout(clearCopyMessage, 4000);
                                            } else {
                                                return;
                                            }
                                            setCopied(true);
                                        }}
                                    >
                                        <div className="card-image">
                                            <div className="flex">
                                                <i className={`icon-minecraft icon-minecraft-${item.namespace_id.replace("_", "-")} item_icon`}></i>
                                                <div className="spacer"></div>
                                                <h4 className="card-header">
                                                    minecraft:{item.namespace_id}
                                                    {item.item_data ? ":" : ""}
                                                    {item.item_data ? item.item_data : ""}
                                                </h4>
                                            </div>
                                            <div className="flex">
                                                <div className="spacer"></div>
                                                <h5 className="card-header">{item.alias}</h5>
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <ol className="card-list" id="test">
                                                <li>
                                                    Numerical ID: <span>{item.item_id}</span>
                                                </li>
                                                <li>
                                                    AUX: <span>{item.item_id * 65536 + (item.item_data ? item.item_data : 0)}</span> {/*add item.item_data when it works again in place of 0*/}
                                                </li>
                                                <li>
                                                    Data Value: <span>{item.item_data ? item.item_data : 0}</span> {/*this should be changed to item.item_data when it works again in place of 0*/}
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                </article>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;
