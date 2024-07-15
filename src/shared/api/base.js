import { getQueryString } from '../tools/getQueryString';

window.bx24 = BX24.getAuth();

export const BX = new (class BX {
    constructor() {
        // this.auth();
        // const urlParams = new URLSearchParams(window.location.search);
        // this.baseUrl = `https://${BX24.getDomain()}`;
    }

    // async auth() {
    //     if (this.session?.access_token) return this.session;
    //     this.session = await BX24.getAuth();
    //     return this.session;
    // }

    async callMethod(name, params = {}) {
        return new Promise((resolve, reject) => {
            BX24.callMethod(name, params, (response) => {
                if (response?.error()) {
                    // throw new Error(response.error());
                    // reject({ ...response.error(), ok: false });
                    const e = response.error();
                    reject(
                        new Error(
                            `Error ${e.status}! ${e.ex.error}: ${e.ex.error_description}`,
                        ),
                    );
                    return;
                }
                resolve({ data: response.data(), ok: true });
            });
        });
    }

    async getAll(name, params = {}) {
        return new Promise((resolve, reject) => {
            let responseAll = [];

            BX24.callMethod(name, params, (response) => {
                if (response?.error()) {
                    reject({ ...response.error(), ok: false });
                    return;
                }

                responseAll = responseAll.concat(response.data());

                if (response.more()) {
                    response.next();
                } else {
                    resolve({ data: responseAll, ok: true });
                }
            });
        });
    }

    async callBatch(calls, bHaltOnError = false) {
        return new Promise((resolve, reject) => {
            const allresponse = [];
            BX24.callBatch(
                calls,
                (response) => {
                    response.forEach((r) => {
                        if (r?.error()) {
                            const e = r.error();
                            reject(
                                new Error(
                                    `Error ${e.status}! ${e.ex.error}: ${e.ex.error_description}`,
                                ),
                            );
                            return;
                        }
                        allresponse.push(r.data());
                    });
                    resolve({ data: allresponse, ok: true });
                },
                bHaltOnError,
            );
        });
    }

    async selectUsers() {
        return new Promise((resolve, reject) => {
            BX24.selectUsers((response) => {
                response.forEach((r) => {
                    if (r?.error) reject({ data: [...response], ok: false });
                });

                resolve({
                    data: [...response],
                    ok: true,
                    time: {
                        date_finish: '0',
                        date_start: '0',
                        duration: 0,
                        finish: 0,
                        processing: 0,
                        start: 0,
                    },
                });
            });
        });
    }

    async fitWindow(duration = 1) {
        setTimeout(() => {
            BX24.fitWindow((res) => {
                return res;
            });
        }, duration);
    }

    async resizeWindow(width, height) {
        setTimeout(() => {
            BX24.resizeWindow(width, height, (res) => res);
        }, 0.1);
    }

    async getScrollSize() {
        return BX24.getScrollSize();
    }

    isAdmin() {
        return BX24.isAdmin();
    }
})();
