#include <stdio.h>
#include <iostream>
#include <string>
#include <sstream>

using namespace std;

int main(void){

        long long input=0,
                    length=0,
                   i=1;
        string squares;
        stringstream ss;


        do{
            cin>>input;
        }while(input>3200000 || input<1);

        while ((input-length)>0){
            ss << (i*i);
            i++;
            length=ss.str().length();
        }

        squares=ss.str();
        cout<<"The digit at position "<<input<<" is: "<<squares[input-1];
        return 0;
}
