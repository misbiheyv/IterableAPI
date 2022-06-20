type IBasicIter = Generator<unknown, void, unknown>
type IEnumerateIter = Generator<unknown[], void, unknown>


export default class Iter<T> {
    public iter: Iterable<any>;

    constructor(iter: Iterable<any>) {
        this.iter = iter
    }
    
    public map(fn: (el: unknown) => unknown): Iter<{iter: IBasicIter}> {
        const iter = this.iter

        const mapIter: IBasicIter = (function *() {
            for (const el of iter) {
                yield fn(el)
            }
        })()

        return new Iter(mapIter)
    }

    public flatMap(fn: (el: unknown) => unknown) {
        const iter = this.iter
    
        function *flatMapIter(arr: Iterable<any>): IBasicIter {
            for (const el of arr) {
                if (el[Symbol.iterator])
                    yield* flatMapIter(el)
                else
                    yield fn(el)
            }
        }
    
        return new Iter(flatMapIter(iter));
    }

    public filter(fn: (el: unknown) => unknown): Iter<{iter: IBasicIter}> {
        const iter = this.iter

        const filterIter: IBasicIter = (function *() {
            for (const el of iter) {
                if(fn(el)) yield el
            }
        })()

        return new Iter(filterIter)
    }

    public forEach(fn: (el: unknown) => never): void {
        const iter = this.iter
        const forEachIter = (function *() {
            yield* iter
        })()

        for (let i = forEachIter.next(); !i.done; i = forEachIter.next()) {
            fn(i.value)
        }
    }

    public asyncForEach(fn: (el: unknown) => void, period: number = 300): Promise<any> {
        const iter = this.iter
        function *_forEach(fn: (el: unknown) => void): Generator {
            let time = Date.now()
        
            for (const el of iter) {
                fn(el)
        
                if (Date.now() - time > period) {
                    yield;
                    time = Date.now()
                }
            }
        }
        
        function executer(iter: Generator, value?: unknown): Promise<any> {
            const 
                res = iter.next(value),
                promise = Promise.resolve(res.value)
        
            if (res.done) return promise
        
            return promise.then(
                (value) => executer(iter, value),
        
                (error) => {
                    const res = iter.throw(error)
        
                    if (res.done) return res.value
        
                    return executer(iter, res.value)
                }
            )
        }

        return executer(_forEach(fn))
    }

    public take(n: number): Iter<{iter: IBasicIter}> {
        const iter = this.iter

        const takeIter: IBasicIter = (function *() {
            for (const el of iter) {
                if (n-- > 0) yield el
            }
        })()

        return new Iter(takeIter)
    }

    public enumerate(): Iter<IEnumerateIter> {
        const iter = this.iter
        
        const enumerateIter: IEnumerateIter = (function *() {
            let i = 0;

            for (const el of iter) {
                yield [i++, el]
            }
        })()

        return new Iter(enumerateIter)
    }

}