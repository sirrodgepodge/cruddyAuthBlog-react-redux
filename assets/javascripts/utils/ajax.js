import request from 'superagent';
import pathJoin from './pathJoin';
import isJSON from './isJSON';

export default {
	makeRequest(o) {
    o.route = o.route || [];
    o.params = o.params || [];
		o.query = o.query ? `?${Object.keys(o.query).map((val) => val + "=" + (o.query[val] && typeof o.query[val] === 'object'? JSON.stringify(o.query[val]) : o.query[val]) ).join("&")}` : "";
		o.body = o.body || {};
		o.headers = o.headers || {
			Accept: 'application/json'
		};
		return new Promise((resolve, reject) => {
			request
      [o.method](pathJoin(o.route, typeof o.params === 'string' ? o.params : pathJoin(...o.params)) + o.query) // if o.params is not string destructure it
      .set(o.headers)
      .send(o.body)
      .end((err, res) => err ?
				reject(err) :
				resolve(isJSON(res.text) ? JSON.parse(res.text) : res.text));
		});
	},
	get(o) {
    if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'get';
		return this.makeRequest(o);
	},
	del(o) {
    if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'del';
		return this.makeRequest(o);
	},
	post(o) {
    if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'post';
		return this.makeRequest(o);
	},
	put(o) {
    if(typeof o === 'string') o = {route: o}; // if string is passed just use that as route
		o.method = 'put';
		return this.makeRequest(o);
	}
};
