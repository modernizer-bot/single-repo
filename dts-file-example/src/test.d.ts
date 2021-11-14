/** @type {(a:number,b:number) => number} */
export function test(a: number, b: number): number;
/**
 * @type {{
 *  user:{name:string,age:number};
 *  auth:string;
 *  subjects:{title:string,content:string}[];
 * }[]}
 */
export const state: {
    user: {
        name: string;
        age: number;
    };
    auth: string;
    subjects: {
        title: string;
        content: string;
    }[];
}[];
