using System.Globalization;

Console.InputEncoding = System.Text.Encoding.UTF8;
Console.OutputEncoding = System.Text.Encoding.UTF8;
var br = new CultureInfo("pt-BR");
var gastos = new List<(string Categoria, decimal Valor)>();

Console.WriteLine("Controle de gastos. Escreva assim: mercado 52,90");
while (true)
{
    Console.Write("\nGasto (ENTER para ver o resumo): ");
    var linha = Console.ReadLine()?.Trim();
    if (string.IsNullOrEmpty(linha)) break;

    var espaco = linha.LastIndexOf(' ');
    if (espaco < 1 || !decimal.TryParse(linha[(espaco + 1)..], NumberStyles.Number, br, out var valor) || valor <= 0)
    {
        Console.WriteLine("Não entendi. Escreva a categoria e o valor: mercado 52,90");
        continue;
    }
    var categoria = linha[..espaco].Trim().ToLower(br);
    gastos.Add((categoria, valor));
    Console.WriteLine($"Anotado: {categoria} {valor.ToString("C", br)}");
}

if (gastos.Count == 0)
{
    Console.WriteLine("Nenhum gasto anotado.");
    return;
}

var total = gastos.Sum(g => g.Valor);
var resumo = gastos
    .GroupBy(g => g.Categoria)
    .Select(g => (Categoria: g.Key, Valor: g.Sum(x => x.Valor)))
    .OrderByDescending(g => g.Valor)
    .ToList();
var maior = resumo[0].Valor;

Console.WriteLine("\n--- Para onde foi o dinheiro ---");
foreach (var (categoria, valor) in resumo)
{
    var barra = new string('█', Math.Max(1, (int)(valor / maior * 20)));
    Console.WriteLine($"{categoria,-12} {barra,-20} {valor.ToString("C", br),12}  {(valor / total).ToString("P0", br)}");
}
Console.WriteLine($"\nTotal do mês: {total.ToString("C", br)}");
