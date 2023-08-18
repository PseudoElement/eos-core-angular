export class AbstratCreatorGraphQlParam {

    public createParamInNumber(param: number[]): string {
        let queryParam: string = '';
        param.forEach(el => {
            if (queryParam.length) {
                queryParam = queryParam + ',' +`{value: ${el}}`;
            } else {
                queryParam = `{value: ${el}}`;
            }
        })
        return queryParam;
    }

    public createParamInString(param: string[]): string {
        let queryParam: string = '';
        param.forEach(el => {
            if (queryParam.length) {
                if(el.includes('"')){
                    queryParam = queryParam + ',' +`{value: ${JSON.stringify(el)}}`;
                } else {
                    queryParam = queryParam + ',' +`{value: "${el}"}`;
                }
            } else {
                if(el.includes('"')){
                    queryParam = `{value: ${JSON.stringify(el)}}`;
                } else {
                    queryParam = `{value: "${el}"}`;
                }
            }
        })
        return queryParam;
    }
}
