import * as XLSX from "xlsx";

const raw = `
1ª Classe (Obrigatórios/ Leitura Orientada) 
 A Viagem do Pai Natal - 5500 AKZ 
 Estrofes da Bicharada - 5000 AKZ 
 Aventura do Vento - 10000 AKZ 
 1ª Classe (Sugeridos/ Leitura Recomendada) 
 O Menino Que Sonhava - 5000 AKZ 
 Aquela Nuvem e Outras - 11000 AKZ 
 2ª Classe (Obrigatórios/ Leitura Orientada) 
 Lengalengas Trava-línguas ... - 6500 AKZ 
 União Arco-Íris - 4500 AKZ 
 Floki o Flamingo Aventureiro - 5000 AKZ 
 2ª Classe (Sugeridos/ Leitura Recomendada) 
 A Origem das Chuvas - 10000 AKZ 
 Guilherme o tagarela e as suas amigas - 5500 AKZ 
 A quinta dos girassóis - 9000 AKZ 
 3ª Classe (Obrigatórios/ Leitura Orientada) 
 A múcua que baloiçava ao vento - 9500 AKZ 
 A disputa entre o vento e o sol e outras histórias - 12000 AKZ 
 Contos de Andersen - 10000 AKZ 
 Vari the Incredible Giant Sable Antelope - 5500 AKZ 
 3ª Classe (Sugeridos/ Leitura Recomendada) 
 Corpos Celestes - 5500 AKZ 
 Cori a Tartaruga em Perigo - 5000 AKZ 
 Tombe o menino da perna mágica - 3500 AKZ 
 4ª Classe (Obrigatórios/ Leitura Orientada) 
 Gosto deles porque sim - 7000 AKZ 
 A Maior Flor do Mundo (a importar) - 12500 AKZ 
 Duas Abelhas Amigas de um Girassol (capa dura) - 5500 AKZ 
 Muadi the Return of the Elephants - 5500 AKZ 
 4ª Classe (Sugeridos/ Leitura Recomendada) 
 O Grande Encontro - 7500 AKZ 
 Histórias da Pedrinha do Sol - 6000 AKZ 
 Sona a beleza de um desenho - 5500 AKZ 
 5ª Classe (Obrigatórios/ Leitura Orientada) 
 Os Candengues no Parque da Quissama - 6000 AKZ 
 A Bicicleta que tinha bigodes - 8000 AKZ (com pequenos defeitos que não afectam a leitura) 
 OU A Bicicleta que tinha bigodes (a importar) - 16500 AKZ 
 A Menina do Mar - 21000 AKZ 
 Charlotte's Web (a importar) - 23000 AKZ 
 5ª Classe (Sugeridos/ Leitura Recomendada) 
 Os Candengues no Cemitério dos Barcos - 6000 AKZ 
 Alex Ponto Com Uma Aventura Virtual - 6500 AKZ 
 A Lagoa Misteriosa - 9000 AKZ 
 6ª Classe (Obrigatórios/ Leitura Orientada) 
 Em Busca do Mar - 5000 AKZ 
 O Principezinho - 10000 AKZ 
 A idade da memória - 10000 AKZ 
 Matilda (in English) (a importar) - 23000 AKZ 
 6ª Classe (Sugeridos/ Leitura Recomendada) 
 Alex Ponto Com Joe Silicone Vai à Escola - 6500 AKZ 
 Uma escuridão bonita (a importar) - 15000 AKZ 
 Outros (1ª a 6ª classe) 
 Dicionário B Ilustrado Língua Portuguesa - 11000 AKZ 
 Dicionário Básico da Língua Portuguesa - 11000 AKZ 
 Dicionário B Ilustrado Ing-Pt/ Pt-Ing - 13000 AKZ 
 Dicionário Ing-Pt / Pt-Ing Escolar - 16500 AKZ 
 Tabuada para todos - 5000 AKZ 
 Gramática Escolar - 7000 AKZ 
 Gramática Júnior - 4000 AKZ 
 Júnior Atlas Escolar - 4500 AKZ 
 Atlas Escolar de Angola (A5) - 8000 AKZ 
 Nova Gramática da Abelhinha 3a e 4a classe - 13000 AKZ 
 Gramática de a português 5a e 6a classe - 15500 AKZ 
 Instrumentos Musicais 
 Melódica Azul (A Importar) - 45000 AKZ 
 Melódica Vermelha (A Importar) - 45000 AKZ 
 Melódica Preta (A Importar) - 45000 AKZ 
 Flauta - 3000 AKZ 
 Tubo de Melódica (sem melódica) - 5000 AKZ 
 7ª Classe (Obrigatórios/ Leitura Orientada) 
 Quem me dera ser onda - 6000 AKZ 
 Fábulas de Sanji - 6500 AKZ 
 O Cavaleiro da Dinamarca - 22000 AKZ 
 Adventures of Huckleberry Finn (a importar) - 23500 AKZ 
 7ª Classe (Sugeridos/ Leitura Recomendada) 
 As Aventuras de Tom Sawyer - 19000 AKZ 
 Alex Ponto com Mary Lob Lagosta - 6500 AKZ 
 8ª Classe (Obrigatórios/ Leitura Orientada) 
 História de uma gaivota e do gato que a ensinou a voar (a importar) - 25000 AKZ 
 O Gato Malhado e a Andorinha (a importar) - 13000 AKZ 
 Os da minha rua - 10000 AKZ 
 Harry Potter and the Philosopher's Stone (a importar) - 26000 AKZ 
 8ª Classe (Sugeridos/ Leitura Recomendada) 
 Poemas com Cacimbo e Pássaros - 6500 AKZ 
 Undengue - 6000 AKZ 
 9ª Classe (Obrigatórios/ Leitura Orientada) 
 Parábola do cágado velho - 9000 AKZ 
 Avó Dezanove e o Segredo do Soviético (a importar) - 20000 AKZ 
 Fantasma de Canterville e outros contos (a importar) - 15000 AKZ 
 Wonder (a importar )- 24500 AKZ 
 9ª Classe (Sugeridos/ Leitura Recomendada) 
 Do rio ao mar - 5 000 AKZ 
 A rainha Ginga - 28500 AKZ 
 10ª Classe 
 Dom Casmurro (a importar) - 17000 AKZ 
 Morte no Nilo (a importar) - 24500 AKZ 
 Contos Fantásticos (não disponível para venda)- Esgotado no Editor 
 To Kill a Mockingbird (a importar )- 27000 AKZ 
 1984 (alunos de direito) - 20500 AKZ 
 11ª Classe 
 O retrato de Dorian Gray (a importar )- 15500 AKZ 
 Esaú e Jacob (a importar) - 33000 AKZ 
 O Vendedor de passados - 27000 AKZ 
 Nervous Conditions (a importar ) - 29000 AKZ 
 12ª Classe 
 
 Manana - 10000 AKZ 
 
 Um Crime no Expresso do Oriente (a importar) - 15000 AKZ 
 
 Auto da Barca do Inferno - 13000 AKZ 
 
 Things Fall Apart (a importar) - 30000 AKZ 
 Livros recomendados 10a a 12a Classe 
 
 Esse Cabelo - 10000 AKZ 
 
 Teoria Geral do Esquecimento - 15000 AKZ 
 
 O Feitiço da Rama de Abóbora - 6000 AKZ 
 Outros (7a a 12a classe) 
 
 A nossa Gramática Ensino Secundário - 29000 AKZ 
 
 Gramática Elementar 2o ciclo - 38000 AKZ 
 
 Atlas de Angola (A4) - 15000 AKZ 
 
 Dicionário Fundamental Língua Portuguesa - 9000 AKZ 
 
 Dicionário Integral da Língua Portuguesa - 20000 AKZ 
 
 Dicionário Verbos mais Gramática Língua Inglesa - 5000 AKZ 
 
 Prontuário de Português - 10000 AKZ 
`;

function parseLines(input: string) {
  const rows: { title: string; unit: number; price: number }[] = [];
  const lines = input.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const m = line.match(/^(.*?)\s*-\s*([\d\s]+)\s*AKZ$/i);
    if (!m) continue;
    const title = m[1].trim();
    const priceStr = m[2].replace(/\s+/g, "");
    const price = parseInt(priceStr, 10);
    if (!title || isNaN(price)) continue;
    rows.push({ title, unit: 5, price });
  }
  return rows;
}

async function run() {
  const data = parseLines(raw);
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Talatona");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const form = new FormData();
  form.append("file", blob, "talatona_books.xlsx");
  const res = await fetch("http://localhost:3001/api/products/import", { method: "POST", body: form });
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
