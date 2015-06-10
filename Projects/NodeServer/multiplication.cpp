#include <node.h>
#include <v8.h>
 
using namespace v8;

// multiply two or more numbers
Handle<Value> Multiplication(const Arguments& args) {
  HandleScope scope;
 
  // throw excetion if less than 2 arguments are provided
  if (args.Length() < 2) {
    ThrowException(Exception::TypeError(String::New("Atleast 2 arguments are required!")));
    return scope.Close(Undefined());
  }
   
  int multiplication = 1;
   
  // throw error if any of the arguments is not a number  
  for (size_t i=0;i<args.Length();i++) {
    if (!args[i]->IsNumber()) {
      ThrowException(Exception::TypeError(String::New("All arguments must be numbers!")));
      return scope.Close(Undefined());
    }
     
    multiplication *= args[i]->NumberValue();
     
  }
   
  Local<Number> num = Number::New(multiplication);
  return scope.Close(num);
}


void init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("Multiplication"),
      FunctionTemplate::New(Multiplication)->GetFunction());
}
 
// list as exported node module  
NODE_MODULE(nodeCppMultiplication, init)