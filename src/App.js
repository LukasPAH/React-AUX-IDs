import { useState, useEffect } from "react";
import "./App.scss";

function App() {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const [q, setQ] = useState("");
    const [searchParam] = useState(["namespace_id", "item_id", "aux_id"]);
    const [filterParam, setFilterParam] = useState(["All"]);
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

                        // You can now even select part of that html as you would in the regular DOM
                        // Example:
                        var docArticle = doc.getElementsByTagName("table").item(9).textContent;

                        // Formatting of text into json, then convert to JSON.
                        var json_1 = docArticle.replace("\n Name ID Aux Values \n\n", "[ { 'namespace_id': '");
                        var json_2 = json_1.replace(/\n\n\n\n/g, " }, { 'namespace_id': '");
                        var json_3 = json_2.replace(/\n0 = Skeleton1 = Wither2 = Zombie3 = Steve4 = Creeper5 = Dragon\n\n\n/g, " }, { 'namespace_id': '");
                        var json_4 = json_3.replace(/\n\n\n/g, " } ]");
                        var json_5 = json_4.replace(/\n/g, "', 'item_id': ");
                        var json_6 = json_5.replace(/'/g, `"`);
                        var actual_json = JSON.parse(json_6);

                        console.log(actual_json);
                        setItems(actual_json);
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
        return items.filter((item) => {
            if (item.type == filterParam) {
                return searchParam.some((newItem) => {
                    return item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1;
                });
            } else if (filterParam == "All") {
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
                        <label htmlFor="search-form">
                            <input type="search" name="search-form" id="search-form" className="search-input" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
                            <span className="sr-only">Search here</span>
                        </label>
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
                                aria-label="Filter Countries By Region"
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
                                aria-label="Filter Countries By Region"
                            >
                                <option value="All">All</option>
                                <option value="Block">Blocks</option>
                                <option value="Item (Old)">Items (Old)</option>
                                <option value="Item (New)">Items (New)</option>
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
                                            console.log(item.item_id * 65536 + 0); /*add item.item_data when it works again in place of 0*/
                                            navigator.clipboard.writeText(item.item_id * 65536 + 0);
                                            if (!copied) {
                                                setTimeout(clearCopyMessage, 4000);
                                            } else {
                                                return;
                                            }
                                            setCopied(true);
                                            isStable(false);
                                            shouldUpdate(true);
                                            setIsLoaded(false);
                                        }}
                                    >
                                        <div className="card-image">
                                            <div className="flex">
                                                <i className={`icon-minecraft icon-minecraft-${item.namespace_id.replace("_", "-")} item_icon`}></i>
                                                <div className="spacer"></div>
                                                <h4 className="card-header">minecraft:{item.namespace_id}</h4>
                                            </div>
                                        </div>
                                        <div className="card-content">
                                            <ol className="card-list" id="test">
                                                <li>
                                                    AUX: <span>{item.item_id * 65536 + 0}</span> {/*add item.item_data when it works again in place of 0*/}
                                                </li>
                                                <li>
                                                    Numerical ID: <span>{item.item_id}</span>
                                                </li>
                                                <li>
                                                    Data Value: <span>0</span> {/*this should be changed to item.item_data when it works again in place of 0*/}
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
