import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageList } from '../interfaces/imageList';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  get(url: string){
    return this.http.get<ImageList[]>(url);
  }
}