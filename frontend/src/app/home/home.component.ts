import { Component, OnInit } from '@angular/core';

export interface News {
  title: string;
  description: string;
  imageLink: string;
  containsImage: boolean;
  videoLink: string;
  containsVideo: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // optional get XY latest blog post from backend
  }

  //hard coded exmaple news post
   news: News[] =[
    {title:"Basic Lib joins Twitter", description: "Tweet tweet, \n We create a twitter account to keep you up to date with various information. Visit our twitter and have a look if you like it and want to follow us (:", imageLink:"https://openvisualfx.com/wp-content/uploads/2019/10/pnglot.com-twitter-bird-logo-png-139932.png", videoLink:"",containsImage:true, containsVideo:false},
    {title:"Reopening during Covid", description: "What a rough time. \n While the pandemic is still going on, and different variation are also spreading we decided that the current situation and with the set rules for hygiene durign pandemic, we can reopening our library starting from 1st of June. \n\n We hope you are alright and stay healthy. \n Your Imagination Library Staff", imageLink:"", videoLink:"",containsImage:false, containsVideo:false},
    {title:"Order books / partial opening", description: "While the pandemic is still going on, we managed to give you the oppurtunity to still borrow media from us starting on 1st of february. Simply put an order for the requested media you want to have and come visit us 1-2 days later and we can loan you the media. Entrance to the bookshelves are still prohibited. :(", imageLink:"", videoLink:"",containsImage:false, containsVideo:false},
    {title:"Temporarly closing", description: "Due to the current situation with covid we are afraid and have to close starting on the 1st of november.", imageLink:"", videoLink:"",containsImage:false, containsVideo:false}
  ];

  mainTile = 0;

}
