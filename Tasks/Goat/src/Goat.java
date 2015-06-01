import java.util.Scanner;
import java.util.Arrays;

public class Goat {

	
	public static void main(String[] args) {
		int numGoats = 0,
			numTraversals = 0;
		
		
		boolean inputFlag;
		do{
			inputFlag=false;
			String goatWeigthInput;
			System.out.print("Enter the number of goats and the number of traversals separated by a space: ");
			Scanner str = new Scanner(System.in);
			goatWeigthInput = str.nextLine();		
			String[] WeightOfGoat = goatWeigthInput.split(" ");
			
			for(int i =0; i<2; i++ ){
				switch (i){
				case 0:
					numGoats = Integer.parseInt(WeightOfGoat[i]);
					break;
				case 1:
					numTraversals = Integer.parseInt(WeightOfGoat[i]);
					break;
				default:
					System.out.println("There has been an error.");
				}
			}
			
			if(numTraversals>1000 || numTraversals<1){
				System.out.println("You have entered " + numTraversals + " traversals. Please enter a value between 1 and 1000.");
				inputFlag = true;
			}
			
			if(numGoats>1000 || numGoats<1){
				System.out.println("You have entered " + numGoats + " goats. Please enter a value between 1 and 1000.");
				inputFlag = true;
			}
		}while(inputFlag==true);
		
		//array to keep track of the weight of all goats
		int[] goatArray = new int[numGoats];
		
		//array to keep track whether the goat has been transported to the other side of the river (0 = not transported)
		boolean[] goatLocationArray = new boolean[numGoats];
		
		boolean weightflag;
		do{
			weightflag=false;
			String goatWeigthInput;
			System.out.print("Please enter the waight of every goat one by one separated by a space: ");
			Scanner str = new Scanner(System.in);
			goatWeigthInput = str.nextLine();		
			String[] WeightOfGoat = goatWeigthInput.split(" ");
			
			for(int i =0; i<WeightOfGoat.length; i++ ){
				goatArray[i] = Integer.parseInt(WeightOfGoat[i]);

				if(WeightOfGoat.length != numGoats){
					System.out.println("The number of values entered is not equal to the number of goats.");
					weightflag = true;
					break;
				}
				
				if(goatArray[i]>100000 || goatArray[i]<1){
					System.out.println("The weight of goat # " + (i+1) + " is " + goatArray[i] + " which is out of the specified limits.");
					System.out.println("Enter a value between 1 and 1000.");
					weightflag = true;
				}
				
			}
		}while(weightflag==true);
		
		Arrays.sort(goatArray);
		
		//the boat is at least as big as the biggest goat
		int minBoatSize=goatArray[numGoats-1] - 1;
		boolean flag = false;
		
		do{
			//all goats are not transported
			for(int i = 0; i < numGoats; ++i){
				goatLocationArray[i] = false;
			}
			flag = false;
			
			minBoatSize++;
			for(int i = 0; i < numTraversals; ++i){
				int currentBoatWeight = 0;
				for(int j = numGoats-1; j >= 0; --j){
					if(currentBoatWeight < minBoatSize){
						if(goatLocationArray[j]==false && (currentBoatWeight+goatArray[j]<=minBoatSize)){
							currentBoatWeight += goatArray[j];
							goatLocationArray[j]=true;
						}
					} 
				}
			}
			
			
			for(int i = 0; i < numGoats; ++i){
				if(goatLocationArray[i] != true){
					flag=true;
					break;
				}
			}
			
		}while(flag == true);
		
		System.out.println("The smallest possible boat is: "+ minBoatSize );
	}//end of class Main

}//end of class Goat
