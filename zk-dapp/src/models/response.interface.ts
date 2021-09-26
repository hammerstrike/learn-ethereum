export interface Response {
    success : boolean;
    data? : {
        [key:string] : any | null
    },
    error? : Error | null
}
