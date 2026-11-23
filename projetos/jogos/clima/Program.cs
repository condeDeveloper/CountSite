using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

Console.InputEncoding = System.Text.Encoding.UTF8;
Console.OutputEncoding = System.Text.Encoding.UTF8;
CultureInfo.CurrentCulture = new CultureInfo("pt-BR");

Console.Write("Cidade: ");
var cidade = Console.ReadLine()?.Trim();
if (string.IsNullOrEmpty(cidade)) return;

using var http = new HttpClient();

// 1) Onde fica a cidade (latitude e longitude)
var busca = await http.GetFromJsonAsync<JsonElement>(
    $"https://geocoding-api.open-meteo.com/v1/search?name={Uri.EscapeDataString(cidade)}&count=1&language=pt");
if (!busca.TryGetProperty("results", out var achados))
{
    Console.WriteLine("Não achei essa cidade.");
    return;
}
var lugar = achados[0];
var lat = lugar.GetProperty("latitude").GetDouble();
var lon = lugar.GetProperty("longitude").GetDouble();

// 2) O tempo agora e nos próximos 5 dias
var url = FormattableString.Invariant(
    $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5");
var tempo = await http.GetFromJsonAsync<JsonElement>(url);

var agora = tempo.GetProperty("current");
Console.WriteLine($"\n{lugar.GetProperty("name").GetString()}, agora: {agora.GetProperty("temperature_2m").GetDouble():0}° {Descreve(agora.GetProperty("weather_code").GetInt32())}\n");

var dias = tempo.GetProperty("daily");
for (var i = 0; i < 5; i++)
{
    var dia = DateTime.Parse(dias.GetProperty("time")[i].GetString()!, CultureInfo.InvariantCulture);
    var max = dias.GetProperty("temperature_2m_max")[i].GetDouble();
    var min = dias.GetProperty("temperature_2m_min")[i].GetDouble();
    Console.WriteLine($"{dia:ddd dd/MM}  {Descreve(dias.GetProperty("weather_code")[i].GetInt32()),-18} máx {max:0}°  mín {min:0}°");
}

static string Descreve(int codigo) => codigo switch
{
    0 => "☀️ céu limpo",
    1 or 2 => "⛅ poucas nuvens",
    3 => "☁️ nublado",
    45 or 48 => "🌫️ neblina",
    >= 51 and <= 67 => "🌧️ chuva",
    >= 71 and <= 77 => "❄️ neve",
    >= 80 and <= 82 => "🌦️ pancadas",
    >= 95 => "⛈️ trovoada",
    _ => "🌡️ variado",
};
