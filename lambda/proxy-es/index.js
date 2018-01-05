var Url=require('url')
var Promise=require('bluebird')
var cfnLambda=require('cfn-lambda')
var request=require('./request')

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    request({
        url:Url.resolve("https://"+event.endpoint,event.path),
        method:event.method,
        body:event.body 
    })
    .then(result=>callback(null,result))
    .catch(error=>callback({
        status:error.response.status,
        message:error.response.statusText,
        body:error.response.data
    }))
}

exports.Create=function(params,reply){
    exports.handler(params.create,null,function(err,data){
        err ? reply(JSON.stringify(err)) : reply(null,"es")
    })
}
exports.Update=function(ID,params,oldparams,reply){
    exports.Create(params,reply) 
}
exports.Delete=function(ID,params,reply){
    if(params.delete){
        exports.handler(params.delete,null,function(err,data){
            err ? reply(JSON.stringify(err)) : reply(null,"es")
        })
    }else{
        reply(null,ID)
    }
}

exports.resource=cfnLambda({
    Create:exports.Create,
    Update:exports.Update,
    Delete:exports.Delete
})



