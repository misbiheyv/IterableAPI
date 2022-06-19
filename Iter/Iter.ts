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

    public filter(fn: (el: unknown) => unknown): Iter<{iter: IBasicIter}> {
        const iter = this.iter

        const filterIter: IBasicIter = (function *() {
            for (const el of iter) {
                if(fn(el)) yield el
            }
        })()

        return new Iter(filterIter)
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