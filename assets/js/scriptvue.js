const app = Vue.createApp({
    data() {
        return {
            eventos: [],
            backupEventos: [],
            eventosPasados: [],
            eventosFuturos: [],
            filtroFuturos: [],
            filtroPasado: [],
            fechaActual: "",
            categoria: [],
            filtroCategoria: [],
            url: "https://amazing-events.herokuapp.com/api/events",
            identi: (new URLSearchParams(location.search).get("id")),
            eventoDetalle: [],
            busqueda: "",
            eventoMayorPorcentaje: "",
            eventoMenorPorcentaje: "",
            mayorCapacidad: "",
            datosFuturos: [],
            datosPasados: [],

        }
    },
    created() {
        this.loadData(this.url);
    },
    mounted() {

    },
    methods: {
        loadData(url) {
            fetch(url)
                .then(response => response.json()
                    .then(data => {
                        this.eventos = data.events;
                        this.backupEventos = this.eventos;
                        this.fechaActual = data.currentDate;
                        this.eventosFuturos = this.eventos.filter(elemento => elemento.date > this.fechaActual);
                        this.eventosPasados = this.eventos.filter(elemento => elemento.date < this.fechaActual);
                        this.filtroFuturos = this.eventosFuturos;
                        this.filtroPasado = this.eventosPasados;
                        this.eventos.forEach(evento => !this.categoria.includes(evento.category) ? this.categoria.push(evento.category) : "");
                        this.eventoDetalle = this.eventos.find(valor => valor._id == this.identi)


                    }))
                .catch(error => console.error(error.message));
        }
    },
    computed: {
        filtroBuscador() {
            let primerFiltro = this.backupEventos.filter(evento => evento.name.toLowerCase().includes(this.busqueda.toLowerCase()))
            if (this.filtroCategoria.length) {
                this.eventos = primerFiltro.filter(evento => this.filtroCategoria.includes(evento.category))
            } else {
                this.eventos = primerFiltro;
            }
        },
        filtroBuscadorF() {

            let primerFiltro = this.filtroFuturos.filter(evento => evento.name.toLowerCase().includes(this.busqueda.toLowerCase()));
            if (this.filtroCategoria.length) {
                this.eventosFuturos = primerFiltro.filter(evento => this.filtroCategoria.includes(evento.category))
            } else {
                this.eventosFuturos = primerFiltro;
            }
        },
        filtroBuscadorP() {
            let primerFiltro = this.filtroPasado.filter(evento => evento.name.toLowerCase().includes(this.busqueda.toLowerCase()));
            if (this.filtroCategoria.length) {
                this.eventosPasados = primerFiltro.filter(evento => this.filtroCategoria.includes(evento.category))
            } else {
                this.eventosPasados = primerFiltro;
            }
        },
        porcentajeStat() {

            let mayorPorcentaje = (this.eventosPasados[0].assistance / this.eventosPasados[0].capacity) * 100;
            let menorPorcentaje = (this.eventosPasados[0].assistance / this.eventosPasados[0].capacity) * 100;
            let capacidad = this.eventosPasados[0].capacity;

            this.eventosPasados.forEach(valor => {
                let resultado = (valor.assistance / valor.capacity) * 100;
                if (resultado > mayorPorcentaje) {
                    mayorPorcentaje = resultado;
                    this.eventoMayorPorcentaje = valor.name;
                } else if (resultado < menorPorcentaje) {
                    menorPorcentaje = resultado;
                    this.eventoMenorPorcentaje = valor.name;
                }
                if (valor.capacity > capacidad) {
                    capacidad = valor.capacity;
                    this.mayorCapacidad = valor.name;
                }
            })
        },
        calcularCategoriaFuturo() {

            this.categoria.forEach(elemento => {
                let suma = 0;
                let capacidad = 0;
                let asistencia = 0;
                let objetoFuturo = {
                    nombre: "",
                    dinero: "",
                    porcentaje: ""
                }
                let eventoEncontrado = this.eventosFuturos.filter(valor => valor.category.includes(elemento));

                eventoEncontrado.forEach(precio => {

                    suma += precio.price * parseInt(precio.estimate);
                    capacidad += parseInt(precio.capacity);
                    asistencia += parseInt(precio.estimate);
                })

                if (suma != 0) {
                    objetoFuturo.nombre = elemento;
                    objetoFuturo.dinero = suma;
                    objetoFuturo.porcentaje = Math.round((asistencia * 100) / capacidad);

                    this.datosFuturos.push(objetoFuturo);
                }

            })


        },
        calcularCategoriaPasado() {

            this.categoria.forEach(elemento => {
                let suma = 0;
                let capacidad = 0;
                let asistencia = 0;
                let objetoPasado = {
                    nombre: "",
                    dinero: "",
                    porcentaje: ""
                }
                let eventoEncontrado = this.eventosPasados.filter(valor => valor.category.includes(elemento));

                eventoEncontrado.forEach(precio => {

                    suma += precio.price * parseInt(precio.assistance);
                    capacidad += parseInt(precio.capacity);
                    asistencia += parseInt(precio.assistance);
                })

                if (suma != 0) {
                    objetoPasado.nombre = elemento;
                    objetoPasado.dinero = suma;
                    objetoPasado.porcentaje = Math.round((asistencia * 100) / capacidad);

                    this.datosPasados.push(objetoPasado);
                }

            })
        }
    }
}).mount('#app')