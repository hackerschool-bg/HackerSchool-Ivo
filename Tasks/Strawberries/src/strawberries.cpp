#include <iostream>
#include <vector>

using namespace std;

int main()
{
    int columns=0,
        rows=0,
        strawberries=0,
        output=0,
        days=0;

    do {
        cout << endl << "Enter the number of columns in your grid [between 2 and 1000]: ";
        cin>>columns;
    } while(columns > 1000 || columns < 2);

    do {
        cout << endl << "Enter the number of rows in your grid [between 1 and "<< columns<< "]: ";
        cin>>rows;
    } while(rows > columns || rows < 1);

    vector<int> strawberryGrid[columns][rows];

    for(int i=0; i < columns; i++){
        for(int j=0; j < rows; j++){
            strawberryGrid[i][j].push_back(0);
        }
    }



    do {
        cout << endl << "Enter the number of strawberries you want to add [either 1 or 2]:";
        cin>>strawberries;
    }while(strawberries != 1 && strawberries != 2);


    int badStrawberries[2][2];

    for(int i = 0; i < strawberries; i++){
        cout<<"Strawberry number:" << i+1;
        do {
            cout << endl << "Enter the X coordinate of the strawberry [between 1 and "<< columns << " ]:";
            cin>>badStrawberries[i][0];
        } while(badStrawberries[i][0] > columns || badStrawberries[i][0] < 1 || (i>0 && badStrawberries[0][0] == badStrawberries[1][0]));

        do {
            cout << endl << "Enter the Y coordinate of the strawberry [between 1 and "<< rows << " ]:";
            cin>>badStrawberries[i][1];
        } while(badStrawberries[i][1] > rows || badStrawberries[i][1] < 1 || (i>0 && badStrawberries[0][1] == badStrawberries[1][1]));
    }

    strawberryGrid[badStrawberries[0][0]-1][ badStrawberries[0][1]-1].clear();
    strawberryGrid[badStrawberries[0][0]-1][ badStrawberries[0][1]-1].push_back(1);

    if(strawberries==2){
        strawberryGrid[badStrawberries[1][0]-1][badStrawberries[1][1]-1].clear();
        strawberryGrid[badStrawberries[1][0]-1][badStrawberries[1][1]-1].push_back(1);
    }

    do {
        cout << endl << "Enter the length of the simulation in days [between 1 and 100]:";
        cin>>days;
    }while(days < 1 || days > 100);

    cout<<"Day: 0"<<endl;
    for(int k=0; k < columns; k++){
        for(int l=0; l < rows; l++){
            cout<<strawberryGrid[k][l].at(0)<<" ";
        }
        cout<<endl;
    }

    for(int d=0; d < days; d++){
        cout<<endl<<"Day: "<<d+1<<endl;

       for(int i=0; i < columns; i++){
            for(int j=0; j < rows; j++){
                //if the strawberry itself is bad we ignore it
                if(strawberryGrid[i][j].at(0)==1){
                    continue;
                }

                if(i==0){
                    if(strawberryGrid[i+1][j].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                }else if(i==(columns-1)){
                    if(strawberryGrid[i-1][j].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                }else{
                    if(strawberryGrid[i-1][j].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                    if(strawberryGrid[i][j].at(0)==2){
                        continue;
                    }else{
                        if(strawberryGrid[i+1][j].at(0)==1){
                            strawberryGrid[i][j].clear();
                            strawberryGrid[i][j].push_back(2);
                        }
                    }
                }

                if(j==0){
                    if(strawberryGrid[i][j+1].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                }else if(j==(rows-1)){
                    if(strawberryGrid[i][j-1].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                }else{
                    if(strawberryGrid[i][j-1].at(0)==1){
                        strawberryGrid[i][j].clear();
                        strawberryGrid[i][j].push_back(2);
                    }
                    if(strawberryGrid[i][j].at(0)==2){
                        continue;
                    }else{
                        if(strawberryGrid[i][j+1].at(0)==1){
                            strawberryGrid[i][j].clear();
                            strawberryGrid[i][j].push_back(2);
                        }
                    }
                }
            }
        }

        for(int k=0; k < columns; k++){
            for(int l=0; l < rows; l++){
                if(strawberryGrid[k][l].at(0)==2){
                    strawberryGrid[k][l].clear();
                    strawberryGrid[k][l].push_back(1);
                }
            }
        }

        for(int k=0; k < columns; k++){
            for(int l=0; l < rows; l++){
                cout<<strawberryGrid[k][l].at(0)<<" ";
            }
            cout<<endl;
        }
    }

    for(int k=0; k < columns; k++){
        for(int l=0; l < rows; l++){
            if(strawberryGrid[k][l].at(0)==0){
                output++;
            }
        }
    }

    cout<< endl <<"The total number of good strawberries is: "<< output <<endl;

    return 0;
}

