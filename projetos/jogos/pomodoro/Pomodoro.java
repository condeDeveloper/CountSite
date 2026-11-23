import javax.swing.*;
import java.awt.*;

public class Pomodoro {
    static final int FOCO = 25 * 60, PAUSA = 5 * 60;
    static int restante = FOCO, ciclos = 0;
    static boolean foco = true;

    public static void main(String[] args) {
        JFrame janela = new JFrame("Pomodoro");
        JLabel tomate = new JLabel("🍅", SwingConstants.CENTER);
        JLabel modo = new JLabel("FOCO", SwingConstants.CENTER);
        JLabel tempo = new JLabel("25:00", SwingConstants.CENTER);
        JLabel feitos = new JLabel("Ciclos feitos: nenhum", SwingConstants.CENTER);
        tomate.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 40));
        tempo.setFont(new Font("SansSerif", Font.BOLD, 64));
        JButton iniciar = new JButton("Iniciar");
        JButton zerar = new JButton("Zerar");

        Timer relogio = new Timer(1000, e -> {
            restante--;
            if (restante < 0) {
                if (foco) ciclos++;
                foco = !foco;
                restante = foco ? FOCO : PAUSA;
                Toolkit.getDefaultToolkit().beep();
            }
            tempo.setText(String.format("%02d:%02d", restante / 60, restante % 60));
            modo.setText(foco ? "FOCO" : "PAUSA");
            feitos.setText("Ciclos feitos: " + (ciclos == 0 ? "nenhum" : "🍅".repeat(ciclos)));
        });

        iniciar.addActionListener(e -> {
            if (relogio.isRunning()) {
                relogio.stop();
                iniciar.setText("Continuar");
            } else {
                relogio.start();
                iniciar.setText("Pausar");
            }
        });

        zerar.addActionListener(e -> {
            relogio.stop();
            foco = true;
            restante = FOCO;
            tempo.setText("25:00");
            modo.setText("FOCO");
            iniciar.setText("Iniciar");
        });

        JPanel botoes = new JPanel();
        botoes.add(iniciar);
        botoes.add(zerar);
        janela.setLayout(new GridLayout(5, 1));
        janela.add(tomate);
        janela.add(modo);
        janela.add(tempo);
        janela.add(feitos);
        janela.add(botoes);
        janela.setSize(320, 430);
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setVisible(true);
    }
}
