using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Interfaces;
using ApiAmSystem.Mappings;
using ApiAmSystem.Services;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("corsPolicy",
        builder =>
        {
            builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        }
    );
});

string connectionStr = "Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True";
builder.Services.AddTransient<SqlConnection>(sc => new SqlConnection(connectionStr));
builder.Services.AddTransient<IPaisesService, PaisesService>();
builder.Services.AddTransient<IEstadosService, EstadosService>();
builder.Services.AddTransient<ICidadesService, CidadesService>();
builder.Services.AddTransient<IFuncionariosService, FuncionariosService>();
builder.Services.AddTransient<IClientesService, ClientesService>();
builder.Services.AddTransient<IFornecedoresService, FornecedoresService>();
builder.Services.AddTransient<IProdutosService, ProdutosService>();
builder.Services.AddTransient<IFormasPagamentosService, FormasPagamentosService>();
builder.Services.AddTransient<ICondicaoPagamentoService, CondicaoPagamentoService>();
builder.Services.AddTransient<IParcelaService, ParcelaService>();
builder.Services.AddTransient<ICategoriaService, CategoriaService>();
builder.Services.AddTransient<IUnidadeMedidaService, UnidadeMedidaService>();
builder.Services.AddTransient<IMappings, Mappings>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corsPolicy");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
