#include <node.h>
#include <v8.h>
 
using namespace v8;

// add two or more numbers together 
Handle<Value> Sum(const Arguments& args) {
  HandleScope scope;
 
  // throw excetion if less than 2 arguments are provided
  if (args.Length() < 2) {
    ThrowException(Exception::TypeError(String::New("Atleast 2 arguments are required!")));
    return scope.Close(Undefined());
  }
   
  int sum = 0;
   
  // throw error if any of the arguments is not a number 
  for (size_t i=0;i<args.Length();i++) {
    if (!args[i]->IsNumber()) {
      ThrowException(Exception::TypeError(String::New("Wrong input! All arguments must be numbers.")));
      return scope.Close(Undefined());
    }
     
    sum += args[i]->NumberValue();
     
  }
   
  Local<Number> num = Number::New(sum);
  return scope.Close(num);
}


void init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("Sum"),
      FunctionTemplate::New(Sum)->GetFunction());
}
 
// list as exported node module 
NODE_MODULE(nodeCppSum, init)