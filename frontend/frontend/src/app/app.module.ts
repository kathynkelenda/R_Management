import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {RouterOutlet} from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from './shared/material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
    imports: [
        BrowserModule,
        RouterOutlet,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
        // FlexLayoutModule,
        // sharedModule

        
    ],
    providers: [
    provideAnimationsAsync()
  ],
    declarations: [
        AppComponent
    ],
    exports: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {}