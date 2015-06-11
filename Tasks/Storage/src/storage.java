import java.util.Scanner;

public class storage {
	
	// calculate free paths
	static int srcFreePaths(int[][] arr) {
		int freePathCounter=0;
		boolean checkH;
		boolean checkV;
		for (int i = 0; i < arr.length; i++) {
			checkH = true;
			checkV = true;
			for (int j = 0; j < arr.length; j++) {
				if(arr[i][j]!=0)
					checkH=false;
				if(arr[j][i]!=0)
					checkV=false;	
			}	
			if(checkV)
				freePathCounter++;
			if(checkH)
				freePathCounter++;		
		}
		return freePathCounter;
	}
	
	// calculate unique items
	static int typeCount (int[][] arr) {
		int typeCounter=0;
		for (int i = 0; i < arr.length; i++) {
			for (int j = 0; j < arr.length; j++) {
				if(arr[i][j]==1){
					if(i==0){
						if(j==0){
							typeCounter++;
						} else if(arr[i][j-1]==0){
							typeCounter++;
						}
					} else if(arr[i-1][j]==0){
						if(j == 0){
							typeCounter++;
						} else if(arr[i][j-1]==0){
							typeCounter++;
						}
					}
				}
			}	
		}
		return typeCounter;
	}
	
	public static void main(String[] args) {
		
		Scanner in = new Scanner(System.in);
		
		boolean wrongInput=false;
		int length=0;
		do{
			System.out.println("Enter the length of the warehouse: ");
			
			try{
				length = in.nextInt();
			} catch(Exception e){
				System.out.print("Wrong Input");
				wrongInput=true;
				break;
			}
			
		}while(length < 1 || length > 100);

		int[][]result = new int[length][length];
		
		if(!wrongInput){
			for (int i = 0; i < length; i++) {
				wrongInput=false;
				for (int j = 0; j < length; j++) {
					
					try {
						result[i][j] = in.nextInt();
						if(result[i][j]!=0 && result[i][j]!= 1){
							System.out.println("Wrong Input");
							wrongInput=true;
							break;
						}
					} catch (Exception e){
						System.out.println("Wrong Input");
						wrongInput=true;
						break;
					}
					
				}
				if(wrongInput){
					break;
				}
			}
		}
		
		if(!wrongInput){
			System.out.println("Free paths: " + srcFreePaths(result) + " Unique items: " + typeCount(result));
		}
		
	}

}
