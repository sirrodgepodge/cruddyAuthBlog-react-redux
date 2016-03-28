var beginslash = /(^\/+)/;
var endslash = /(\/+$)/;
var midslash = /(\/+)/g;

export default function pathJoin(...args){
  return args.map(function(val, index){
    return val = typeof val==='string'? val.replace(beginslash, '').replace(endslash,'').replace(midslash,'/') : val.toString(), val ? '/'+val : '';
  }).join('');
}
