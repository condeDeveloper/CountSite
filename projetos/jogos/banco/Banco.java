import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Scanner;

public class Banco {
    static double saldo = 0;
    static List<String> extrato = new ArrayList<>();

    static void depositar(double valor) {
        if (valor <= 0) {
            System.out.println("Valor inválido.");
            return;
        }
        saldo += valor;
        extrato.add(String.format("+ R$ %.2f  depósito", valor));
        System.out.printf("Depósito feito. Saldo: R$ %.2f%n", saldo);
    }

    static void sacar(double valor) {
        if (valor <= 0) {
            System.out.println("Valor inválido.");
            return;
        }
        if (valor > saldo) {
            System.out.println("Saldo insuficiente.");
            return;
        }
        saldo -= valor;
        extrato.add(String.format("- R$ %.2f  saque", valor));
        System.out.printf("Saque feito. Saldo: R$ %.2f%n", saldo);
    }

    static void mostrarExtrato() {
        System.out.println("\n--- Extrato ---");
        if (extrato.isEmpty()) System.out.println("Nenhuma movimentação ainda.");
        extrato.forEach(System.out::println);
        System.out.printf("Saldo: R$ %.2f%n", saldo);
    }

    static double lerValor(Scanner entrada) {
        System.out.print("Valor: R$ ");
        try {
            return Double.parseDouble(entrada.nextLine().trim().replace(",", "."));
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    public static void main(String[] args) {
        Locale.setDefault(Locale.of("pt", "BR"));
        Scanner entrada = new Scanner(System.in);
        System.out.println("Bem-vindo ao Mini Banco!");
        while (true) {
            System.out.println("\n1) Depositar  2) Sacar  3) Extrato  0) Sair");
            System.out.print("Escolha: ");
            if (!entrada.hasNextLine()) return;
            switch (entrada.nextLine().trim()) {
                case "1" -> depositar(lerValor(entrada));
                case "2" -> sacar(lerValor(entrada));
                case "3" -> mostrarExtrato();
                case "0" -> {
                    System.out.println("Até logo!");
                    return;
                }
                default -> System.out.println("Opção inválida.");
            }
        }
    }
}
