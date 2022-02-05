function isNode(){
    return (typeof window === 'undefined')
}

function run(src:string){
    const dict: {[key:string]: string} = {
        '\n': '`',
        '몰?루': '0',
        '몰!루': '1',
        '몰루': '2',
        '몰??루': '3',
        '몰!?루': '4',
        "몰?!루": '5',
        '몰???루': '6',
        '몰!??루': '7',
        '몰!!?루': '8',
        '몰!!!루': '9',
        '아?루': '.',
        '아!루': '-',
        " ": 'a',
        "!": '`'
    }
    let memory: {[key:string]: number} = {}
    let d:string[] = []
    let d2:string = ''
    src += '\n'
    src = src.replaceAll('    ','')
    while(src.length > 0){
        let m = '+'
        for(const i in dict){
            const a = dict[i]
            if(src.startsWith(i)){
                src = src.substring(i.length)
                m = a
                break
            }
        }
        if(m === '`'){
            if(d2.length > 0){
                d.push(d2)
                d2 = ""
            }
        }
        else if(m === '+'){
            src = src.substring(1)
        }
        else{
            d2 += (m)
        }
    }
    function checkArgs(line:string[], num: number){
        if(line.length !== num){
            throw `arg is not correct ${line.length} | ${num}`
        }
    }
    function throwError(msg:string = 'arg is not correct'){
        throw(msg)
    }
    function selection(line:string[], first:number): number{
        if(line[first] == '0'){
            return parseInt(line[first + 1])
        }
        else if(line[first] == '1'){
            return  memory[line[first + 1]]
        }
        else{
            throwError()
            return 0
        }
    }
    let gmemory = ''
    let i = 0
    while(i < d.length){
        const line:string[] = d[i].split('a')
        switch(line[0]){
            case '0': //변수 설정
                checkArgs(line, 4)
                memory[line[1]] = selection(line, 2)
                break;
            case '1': //출력데이터에 추가
                checkArgs(line, 3)
                if(line[1] == '0'){
                    gmemory += (memory[line[2]])
                }
                else if(line[1] == '1'){
                    gmemory += (String.fromCharCode(memory[line[2]]))
                }
                else{
                    throwError()
                }
                break;
            case '2': //출력데이터 출력
                checkArgs(line, 1)
                console.log(gmemory)
                gmemory = ''
                break
            case '3': //Math
                checkArgs(line, 5)
                switch(line[1]){
                    case '0':
                        memory[line[2]] += selection(line, 3)
                        break
                    case '1':
                        memory[line[2]] -= selection(line, 3)
                        break 
                    case '2':
                        memory[line[2]] *= selection(line, 3)
                        break
                    case '3':
                        memory[line[2]] /= selection(line, 3)
                        break
                    default:
                        throwError()
                }
                break;
            case '4':
                checkArgs(line, 2)
                if(isNode()){
                    memory[line[1]] = parseInt(require("readline-sync").question())
                }
                else{
                    let p
                    while(p === undefined || p === null){
                        p = prompt("")
                    }
                    memory[line[1]] = parseInt(p)
                }
                break
            case '5':
                if(d[i] === '5a5'){
                    break
                }
                checkArgs(line, 5)
                let isTrue = false
                switch(line[1]){
                    case "0":
                        isTrue = (memory[line[2]] === selection(line, 3))
                        break
                    case "1":
                        isTrue = (memory[line[2]] > selection(line, 3))
                        break
                    case "2":
                        isTrue = (memory[line[2]] < selection(line, 3))
                        break
                    case "3":
                        isTrue = (memory[line[2]] >= selection(line, 3))
                        break
                    case "4":
                        isTrue = (memory[line[2]] <= selection(line, 3))
                        break
                    default:
                        throwError("syntax error")
                        break
                }
                if(!isTrue){
                    while(!(d[i] === '5a5')){
                        if(i > d.length){
                            throwError("syntax error")
                        }
                        i++
                    }
                }
                break
            case '.':
                checkArgs(line, 2)
                memory['l' + line[1]] = i
            case '-':
                checkArgs(line, 2)
                i = memory['l' + line[1]]
            default:
                break;
        }
        i++
    }
}

if(isNode()){
    exports.run = run
}