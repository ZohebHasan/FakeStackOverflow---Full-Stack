import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { useMainPageContext } from "../MainPageContext";

function SideBar() {
    const tabs = ["Questions", "Tags", "Profile"];
    const {
        setActiveSort,
        setActiveTab,
    } = useMainPageContext();

    return (
        <div id="sideBar">
            <nav role="navigation">
                <ol className="navLinks">
                    {tabs.map((tab, index) => (
                        <li key={index}>
                            <div
                                className="sideBarLinkContainer"
                                id="qButtonContainer"
                            >
                                <button
                                    className="sideBarLink"
                                    id="qButton"
                                    onClick={() => {
                                        setActiveSort(0);
                                        if (index !== 2) {
                                            setActiveTab(index);
                                        } else {
                                            setActiveTab(8);
                                        }
                                    }}
                                >
                                    {tab}
                                </button>
                            </div>
                        </li>
                    ))}
                    {/*<li>
					<Link to="/user-profile" className="profile-btn">Profile</Link>
                                </li>*/}
                </ol>
            </nav>
        </div>
    );
}

export default SideBar;
