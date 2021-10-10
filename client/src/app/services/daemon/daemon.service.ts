import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DaemonService {
  private daemonUrl = environment.daemonUrl;

  constructor(private http: HttpClient) {}

  public async post(path: string, body: any) {
    return await this.http.post(this.daemonUrl + path, body).toPromise();
  }

  public async postFile(path: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const req = new HttpRequest('POST', this.daemonUrl + path, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return await this.http.request(req).toPromise();
  }

  public async get(path: string, params: any) {
    const urlParams = new HttpParams(params);

    return await this.http
      .get(this.daemonUrl + path, params ? { params: urlParams } : {})
      .toPromise();
  }

  public async startNewJob(cid: string, job_runtime: string) {
    console.log("Starting new job", cid, job_runtime);

    return await this.post("/job/start", {cid, job_runtime});
  }

  public async jobStatus(container_id: string) {
    return await this.get("/job/status", {container_id});
  }

  public async uploadToIPFS(file: File) {
    return await this.postFile("/ipfs/upload", file);
  }
}