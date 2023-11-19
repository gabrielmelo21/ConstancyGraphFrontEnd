import { Component } from '@angular/core';
import {MainAPIService} from "./service/main-api.service";
import {catchError, finalize, map, Observable, tap} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  objetivoSelected: String = "";
  loading: boolean = false;
  gerandoGraphMSG: boolean = false;
  waitingHomeImg: boolean = true;


  title = 'ConstancyGraph';
  myForm: FormGroup;
  public listByObjetivo$: Observable<any> | undefined;
  public listAllUnique$: Observable<any> | undefined;
  constructor(private mainAPI: MainAPIService, private formBuilder: FormBuilder, private _snackBar: MatSnackBar) {
    this.myForm = this.formBuilder.group({
      newObjetivo: ['', Validators.required]
    });

    this.listAllUnique();
  }





  public updateData(objetivo: String){
      this.mainAPI.update(objetivo).subscribe();
      // @ts-ignore
    this.listByObjetivo(objetivo);

  }









 public listAllUnique(){
    this.listAllUnique$ = this.mainAPI.uniqueObjetivos()
 }

  public listByObjetivo(objetivo: string) {
    this.loading = true; // Atualiza o estado de carregamento para true antes da chamada à API

    this.listByObjetivo$ = this.mainAPI.listByObjetivo(objetivo).pipe(
      finalize(() => {
        // Atualiza o estado de carregamento para false após a chamada à API, independentemente de sucesso ou erro
        this.loading = false;
      })
    );
  }
 public changeGraph(objetivo: String){
     this.waitingHomeImg = false;
     this.objetivoSelected = objetivo;
     // @ts-ignore
   this.listByObjetivo(objetivo);
 }






  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duração em milissegundos (opcional)
    });
  }



  isFormOpen = false;

  openForm(): void {
   this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }





// AÇÃO APOS CLICAR NO BOTÃO DE ADICIONAR NOVO GRAPH
  onSubmit() {
    this.waitingHomeImg = false;
    this.objetivoSelected = "" ;
    this.gerandoGraphMSG = true;
    const newObjetivo = this.myForm.get('newObjetivo');
    this.loading = true; // Atualiza o estado de carregamento para true antes da chamada à API

    this.mainAPI.createNewGraph(newObjetivo?.value).pipe(
      catchError((error) => {
        let errorMessage = 'Ocorreu um erro. Por favor, tente novamente.';

        if (error instanceof HttpErrorResponse && error.status === 201) {
          // Tratar o status 201 conforme necessário
          errorMessage = 'Novo Graph criado com sucesso';
        } else if (error.error instanceof ProgressEvent) {
          // Tratar erros de parsing do JSON
          errorMessage = 'Erro ao analisar a resposta da API';
        }

        this.openSnackBar(errorMessage, 'close');
        throw error; // Propaga o erro para que outros observadores possam tratá-lo, se necessário
      }),
      finalize(() => {
        // Atualiza o estado de carregamento para false após a chamada à API, independentemente de sucesso ou erro
        this.gerandoGraphMSG = false;
        this.loading = false;
        this.listAllUnique();
        this.waitingHomeImg = true;
      })
    ).subscribe();
  }



}
