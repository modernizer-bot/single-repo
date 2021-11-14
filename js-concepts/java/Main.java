public class Main {
    public static void main(String[] args) {
        MyThread firstThread = new MyThread("/home/tc/Downloads/js-concepts/java/first");
        firstThread.start();

        MyThread secondThread = new MyThread("/home/tc/Downloads/js-concepts/java/second");
        secondThread.start();

        MyThread thirdThread = new MyThread("/home/tc/Downloads/js-concepts/java/third");
        thirdThread.start();
    }
}
