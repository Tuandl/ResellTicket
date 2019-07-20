import TopBarComponent from "./component/TopBarComponent.js";
import NavigationComponent from "./component/NavigationComponent.js";

function topBar() {
    new TopBarComponent().render();
    new NavigationComponent().render();
}

topBar();