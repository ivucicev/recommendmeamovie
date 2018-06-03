import { Component } from '@angular/core';

import { Discover } from '../Discover/Discover';
import { Watchlist } from '../Watchlist/Watchlist';
import { Settings } from '../Settings/Settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = Discover;
  tab2Root: any = Watchlist;
  tab3Root: any = Settings;

  constructor() {

  }
}
