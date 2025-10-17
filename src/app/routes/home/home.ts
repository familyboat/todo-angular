import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { routerConfig } from '../../configs';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly routerConfig = routerConfig;
}
