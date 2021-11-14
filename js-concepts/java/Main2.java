public class Main2 {
    public static void main(String[] args) {
        MyThread firstThread = new MyThread("/home/tc/Downloads/js-concepts/java/first");
        firstThread.start();
        while(firstThread.getState()!=Thread.State.TERMINATED);
        MyThread secondThread = new MyThread("/home/tc/Downloads/js-concepts/java/second");
        secondThread.start();
        while(secondThread.getState()!=Thread.State.TERMINATED);
        MyThread thirdThread = new MyThread("/home/tc/Downloads/js-concepts/java/third");
        thirdThread.start();
    }
}
