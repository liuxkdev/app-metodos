import { useMemo, useState } from "react";
import { create, all } from "mathjs";

import Plot from "react-plotly.js";
import {
    Atom,
    House,
    Calculator,
    ChartNoAxesCombined,
    GitBranch,
    FunctionSquare,
    Settings,
    CircleHelp,
    Search,
    Bell,
    ChevronDown,
    Play,
    RotateCcw,
    CheckCircle2,
    Menu,
    X,
} from "lucide-react";
import "./App.css";

const initialFunction = "x - 1";
const math = create(all);

function evaluateFunction(x, expression) {

    const result = math.evaluate(expression, { x });

    if (typeof result !== "number" || !Number.isFinite(result)) {
        throw new Error("La función debe producir un número real y finito.");
    }

    return result;
}

function bisection(expression, a, b, tolerance, maxIterations) {
    let fa = evaluateFunction(a, expression);
    let fb = evaluateFunction(b, expression);

    if (fa * fb > 0) {
        throw new Error(
            "Los extremos deben tener signos opuestos para aplicar bisección.",
        );
    }

    const rows = [];
    let midpoint = a;

    for (let i = 1; i <= maxIterations; i++) {
        midpoint = (a + b) / 2;
        const fm = evaluateFunction(midpoint, expression);

        rows.push({
            iteration: i,
            a,
            b,
            midpoint,
            fm,
            error: Math.abs(b - a) / 2,
        });

        if (Math.abs(fm) < tolerance || Math.abs(b - a) / 2 < tolerance) {
            break;
        }

        if (fa * fm < 0) {
            b = midpoint;
            fb = fm;
        } else {
            a = midpoint;
            fa = fm;
        }
    }

    return { root: midpoint, rows };
}

const navigation = [
    { label: "Inicio", icon: House },
    { label: "Métodos numéricos", icon: Calculator },
    { label: "Derivadas", icon: FunctionSquare },
    { label: "Integración", icon: ChartNoAxesCombined },
    { label: "Interpolación", icon: GitBranch },
];

export default function App() {
    const [expression, setExpression] = useState(initialFunction);
    const [left, setLeft] = useState("1");
    const [right, setRight] = useState("2");
    const [tolerance, setTolerance] = useState("0.0001");
    const [maxIterations, setMaxIterations] = useState("100");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [activePage, setActivePage] = useState("Métodos numéricos");
    const [mobileMenu, setMobileMenu] = useState(false);

    const graph = useMemo(() => {
        try {
            const a = Number(left);
            const b = Number(right);

            if (!Number.isFinite(a) || !Number.isFinite(b) || a >= b) {
                return null;
            }

            const x = Array.from(
                { length: 201 },
                (_, i) => a - (b - a) * 0.25 + ((b - a) * 1.5 * i) / 200,
            );

            const y = x.map((value) => evaluateFunction(value, expression));

            return { x, y };
        } catch {
            return null;
        }
    }, [expression, left, right]);

    function calculate() {
        setError("");
        setResult(null);

        try {
            const a = Number(left);
            const b = Number(right);
            const tol = Number(tolerance);
            const iterations = Number(maxIterations);

            if (![a, b, tol, iterations].every(Number.isFinite)) {
                throw new Error("Introduce valores numéricos válidos.");
            }

            if (tol <= 0 || iterations < 1 || !Number.isInteger(iterations)) {
                throw new Error(
                    "La tolerancia debe ser positiva y las iteraciones un entero mayor que cero.",
                );
            }

            const answer = bisection(expression, a, b, tol, iterations);
            setResult(answer);
        } catch (err) {
            setError(err.message || "No se pudo calcular el resultado.");
        }
    }

    function reset() {
        setExpression(initialFunction);
        setLeft("1");
        setRight("2");
        setTolerance("0.0001");
        setMaxIterations("100");
        setResult(null);
        setError("");
    }

    return (
        <div className="app-shell">
            <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
                <div className="brand">
                    <div className="brand-mark">
                        <Atom size={24} />
                    </div>
                    <div>
                        <h1>Numeria</h1>
                        <span>LABORATORIO NUMÉRICO</span>
                    </div>
                    <button
                        className="mobile-close icon-button"
                        onClick={() => setMobileMenu(false)}
                        aria-label="Cerrar menú"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="nav-caption">MENÚ PRINCIPAL</div>
                <nav className="navigation">
                    {navigation.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            className={`nav-item ${activePage === label ? "active" : ""}`}
                            onClick={() => {
                                setActivePage(label);
                                setMobileMenu(false);
                            }}
                        >
                            <Icon size={19} strokeWidth={1.8} />
                            <span>{label}</span>
                            {label === "Métodos numéricos" && (
                                <span className="nav-count">4</span>
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {mobileMenu && (
                <button
                    className="mobile-overlay"
                    onClick={() => setMobileMenu(false)}
                    aria-label="Cerrar menú"
                />
            )}

            <main className="main-area">
                <header className="topbar">
                    <div className="breadcrumb">
                        <button
                            className="mobile-menu-button icon-button"
                            onClick={() => setMobileMenu(true)}
                            aria-label="Abrir menú"
                        >
                            <Menu size={21} />
                        </button>
                        <span>Herramientas</span>
                        <span className="breadcrumb-separator">/</span>
                        <strong>{activePage}</strong>
                    </div>
                </header>

                <div className="content">
                    <section className="page-heading">
                        <div>
                            <div className="eyebrow">
                                <span /> ESPACIO DE TRABAJO
                            </div>
                            <h2>
                                Explora las matemáticas<span>.</span>
                            </h2>
                            <p>
                                Resuelve, visualiza y comprende cada paso del
                                proceso.
                            </p>
                        </div>
                        <div className="heading-decoration">
                            <Atom size={37} strokeWidth={1.2} />
                        </div>
                    </section>

                    <section className="method-heading">
                        <div className="method-icon">
                            <Calculator size={22} />
                        </div>
                        <div>
                            <div className="section-kicker">
                                MÉTODOS NUMÉRICOS <span>•</span> RAÍCES
                            </div>
                            <h3>Método de bisección</h3>
                            <p>
                                Encuentra una raíz aproximada reduciendo el
                                intervalo a la mitad en cada iteración.
                            </p>
                        </div>
                    </section>

                    <div className="workspace-grid">
                        <section className="panel configuration-panel">
                            <div className="panel-heading">
                                <div>
                                    <h4>Configuración</h4>
                                    <p>Define la función y los parámetros.</p>
                                </div>
                            </div>

                            <label className="field-label" htmlFor="function">
                                Función f(x)
                            </label>
                            <div className="function-input">
                                <span>ƒ</span>
                                <input
                                    id="function"
                                    value={expression}
                                    onChange={(e) =>
                                        setExpression(e.target.value)
                                    }
                                    spellCheck="false"
                                    placeholder="Ej. x**3 - x - 2"
                                />
                            </div>
                            <p className="field-hint">
                                Usa x**2 para potencias. Ejemplo: x**2 - 4.
                            </p>

                            <div className="field-divider" />

                            <div className="field-label-row">
                                <label className="field-label">
                                    Intervalo inicial
                                </label>
                                <span className="small-info">[ a, b ]</span>
                            </div>
                            <div className="two-fields">
                                <div className="number-field">
                                    <label htmlFor="left">Límite a</label>
                                    <input
                                        id="left"
                                        type="number"
                                        value={left}
                                        onChange={(e) =>
                                            setLeft(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="number-field">
                                    <label htmlFor="right">Límite b</label>
                                    <input
                                        id="right"
                                        type="number"
                                        value={right}
                                        onChange={(e) =>
                                            setRight(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="field-divider" />

                            <div className="two-fields">
                                <div className="number-field">
                                    <label htmlFor="tolerance">
                                        Tolerancia
                                    </label>
                                    <input
                                        id="tolerance"
                                        type="number"
                                        min="0"
                                        step="any"
                                        value={tolerance}
                                        onChange={(e) =>
                                            setTolerance(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="number-field">
                                    <label htmlFor="iterations">
                                        Máx. iteraciones
                                    </label>
                                    <input
                                        id="iterations"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={maxIterations}
                                        onChange={(e) =>
                                            setMaxIterations(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="info-note">
                                <span className="info-symbol">i</span>
                                <p>
                                    La función debe ser continua y presentar
                                    signos opuestos en los extremos del
                                    intervalo.
                                </p>
                            </div>

                            {error && (
                                <div className="error-message">{error}</div>
                            )}

                            <div className="form-actions">
                                <button
                                    className="primary-button"
                                    onClick={calculate}
                                >
                                    <Play size={16} fill="currentColor" />{" "}
                                    Calcular raíz
                                </button>
                                <button
                                    className="secondary-button"
                                    onClick={reset}
                                    aria-label="Restablecer valores"
                                >
                                    <RotateCcw size={17} />
                                </button>
                            </div>
                            <p className="form-footnote">
                                *Siempre que se cumplan las condiciones del
                                método.
                            </p>
                        </section>

                        <section className="panel graph-panel">
                            <div className="panel-heading graph-heading">
                                <div>
                                    <h4>Visualización gráfica</h4>
                                    <p>
                                        Representación de la función en el
                                        intervalo seleccionado.
                                    </p>
                                </div>
                            </div>

                            <div className="graph-legend">
                                <span>
                                    <i className="legend-line" /> f(x)
                                </span>
                                <span>
                                    <i className="legend-root" /> Eje x
                                </span>
                                {result && (
                                    <span>
                                        <i className="legend-point" /> Raíz
                                        aproximada
                                    </span>
                                )}
                            </div>

                            {graph ? (
                                <Plot
                                    data={[
                                        {
                                            x: graph.x,
                                            y: graph.y,
                                            type: "scatter",
                                            mode: "lines",
                                            name: "f(x)",
                                            line: {
                                                color: "#7865e8",
                                                width: 3,
                                            },
                                            hovertemplate:
                                                "x = %{x:.5f}<br>f(x) = %{y:.5f}<extra></extra>",
                                        },
                                        {
                                            x: graph.x,
                                            y: graph.x.map(() => 0),
                                            type: "scatter",
                                            mode: "lines",
                                            name: "Eje x",
                                            line: {
                                                color: "#a5a6b4",
                                                width: 1.2,
                                                dash: "dot",
                                            },
                                            hoverinfo: "skip",
                                        },
                                        ...(result
                                            ? [
                                                  {
                                                      x: [result.root],
                                                      y: [
                                                          evaluateFunction(
                                                              result.root,
                                                              expression,
                                                          ),
                                                      ],
                                                      type: "scatter",
                                                      mode: "markers",
                                                      name: "Raíz aproximada",
                                                      marker: {
                                                          color: "#19a98c",
                                                          size: 11,
                                                          line: {
                                                              color: "#ffffff",
                                                              width: 2,
                                                          },
                                                      },
                                                  },
                                              ]
                                            : []),
                                    ]}
                                    layout={{
                                        autosize: true,
                                        margin: { l: 52, r: 20, t: 15, b: 45 },
                                        paper_bgcolor: "rgba(0,0,0,0)",
                                        plot_bgcolor: "rgba(0,0,0,0)",
                                        font: {
                                            family: "Inter, Segoe UI, sans-serif",
                                            color: "#77788b",
                                            size: 11,
                                        },
                                        xaxis: {
                                            title: "x",
                                            gridcolor: "#eeedf5",
                                            zeroline: false,
                                            automargin: true,
                                        },
                                        yaxis: {
                                            title: "f(x)",
                                            gridcolor: "#eeedf5",
                                            zeroline: false,
                                            automargin: true,
                                        },
                                        showlegend: false,
                                    }}
                                    config={{
                                        responsive: true,
                                        displaylogo: false,
                                        modeBarButtonsToRemove: [
                                            "lasso2d",
                                            "select2d",
                                        ],
                                    }}
                                    style={{ width: "100%", height: "100%" }}
                                    useResizeHandler
                                />
                            ) : (
                                <div className="graph-empty">
                                    <ChartNoAxesCombined size={35} />
                                    <strong>
                                        No se puede graficar esta función
                                    </strong>
                                    <span>
                                        Revisa la expresión y los límites del
                                        intervalo.
                                    </span>
                                </div>
                            )}

                            <div className="graph-footer">
                                <span>
                                    <span className="footer-dot" /> Función
                                    evaluada en tiempo real
                                </span>
                                <span>Zoom y desplazamiento disponibles</span>
                            </div>
                        </section>
                    </div>

                    <section className="results-section">
                        <div className="results-title">
                            <div>
                                <h4>Resultados del cálculo</h4>
                                <p>
                                    Resumen de la última ejecución del método.
                                </p>
                            </div>
                            {result && (
                                <span className="success-tag">
                                    <CheckCircle2 size={15} /> Cálculo
                                    completado
                                </span>
                            )}
                        </div>

                        {result ? (
                            <>
                                <div className="result-cards">
                                    <div className="result-card highlighted">
                                        <span>RAÍZ APROXIMADA</span>
                                        <strong>
                                            {result.root.toFixed(8)}
                                        </strong>
                                        <small>Valor de x</small>
                                    </div>
                                    <div className="result-card">
                                        <span>f(raíz)</span>
                                        <strong>
                                            {evaluateFunction(
                                                result.root,
                                                expression,
                                            ).toExponential(3)}
                                        </strong>
                                        <small>Residuo de la función</small>
                                    </div>
                                    <div className="result-card">
                                        <span>ITERACIONES</span>
                                        <strong>{result.rows.length}</strong>
                                        <small>Pasos ejecutados</small>
                                    </div>
                                    <div className="result-card">
                                        <span>ERROR ESTIMADO</span>
                                        <strong>
                                            {result.rows
                                                .at(-1)
                                                .error.toExponential(3)}
                                        </strong>
                                        <small>Mitad del intervalo final</small>
                                    </div>
                                </div>

                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Iteración</th>
                                                <th>a</th>
                                                <th>b</th>
                                                <th>c (punto medio)</th>
                                                <th>f(c)</th>
                                                <th>Error estimado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.rows.map((row) => (
                                                <tr key={row.iteration}>
                                                    <td>{row.iteration}</td>
                                                    <td>{row.a.toFixed(6)}</td>
                                                    <td>{row.b.toFixed(6)}</td>
                                                    <td>
                                                        {row.midpoint.toFixed(
                                                            8,
                                                        )}
                                                    </td>
                                                    <td>
                                                        {row.fm.toExponential(
                                                            3,
                                                        )}
                                                    </td>
                                                    <td>
                                                        {row.error.toExponential(
                                                            3,
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div className="results-placeholder">
                                <div className="placeholder-icon">
                                    <Calculator size={22} />
                                </div>
                                <div>
                                    <strong>
                                        Tus resultados aparecerán aquí
                                    </strong>
                                    <p>
                                        Introduce una función y pulsa «Calcular
                                        raíz» para comenzar.
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>

                    <footer className="app-footer">
                        <span>
                            NUMERIA <span>v0.1.0</span>
                        </span>
                        <span>
                            Hecho para aprender matemáticas <span>✳</span>
                        </span>
                    </footer>
                </div>
            </main>
        </div>
    );
}
