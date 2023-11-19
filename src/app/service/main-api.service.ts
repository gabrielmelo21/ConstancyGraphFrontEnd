import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class MainAPIService {

  constructor(private http: HttpClient) { }
  private readonly API = 'http://localhost:8091/api';


  public listByObjetivo(objetivo: String){
    return this.http.get<any>(this.API + "/" + objetivo);

  }

  public createNewGraph(objetivo: String) {
    return this.http.post<any>(this.API, objetivo);
  }


/**public listAllgraph(){
    return this.http.get(this.API)
}**/

public uniqueObjetivos(){
    return this.http.get(this.API + "/uniqueObjetivos")
  }
  public update(objetivo: String){
    return this.http.put<any>(this.API + "/" + objetivo, objetivo)
  }





}
