import java.io.BufferedReader;
import java.io.FileNotFoundException; // Import this class to handle errors
import java.io.FileReader;
import java.io.IOException;

public class MyThread extends Thread {
  String fileName = "";

  public MyThread(String fileName) {
    this.fileName = fileName;
  }

  public void run() {
    BufferedReader br = null;
    String everything = "";
    try {
      br = new BufferedReader(new FileReader(this.fileName));
      StringBuilder sb = new StringBuilder();
      String line = br.readLine();

      while (line != null) {
        sb.append(line);
        sb.append(System.lineSeparator());
        line = br.readLine();
      }
      everything = sb.toString();
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    } finally {
      try {
        if (br != null) {
          br.close();
        }
      } catch (IOException e) {
        e.printStackTrace();
      }
      System.out.println(everything);
    }
  }
}