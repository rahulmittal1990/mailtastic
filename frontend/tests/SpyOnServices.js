spyOnAngularService=function(service,methodName,result){
return spyOn(service,methodName).and.returnValue({then:function(fn){
fn(result);
}
});
};