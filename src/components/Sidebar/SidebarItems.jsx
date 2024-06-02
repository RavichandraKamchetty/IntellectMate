import CreatePost from "./CreatePost";
import DarkLightColor from "./DarkLightColor";
import Home from "./Home";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Search from "./Search";

const SidebarItems = () => {
    return (
        <>
            <Home />
            <Search />
            <Notifications />
            <CreatePost />
            <Profile />
            {/* <DarkLightColor /> */}
        </>
    );
};

export default SidebarItems;
