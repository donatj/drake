// Copyright 2023 Jesse G. Donat

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const drake = (R: number, fp: number, ne: number, fl: number, fi: number, fc: number, L: number) : number => R * fp * ne * fl * fi * fc * L;

class DrakeUI {

	private readonly inputs = [
		this.R,
		this.fp,
		this.ne,
		this.fl,
		this.fi,
		this.fc,
		this.L
	];

	public constructor(
		private readonly R: HTMLInputElement,
		private readonly fp: HTMLInputElement,
		private readonly ne: HTMLInputElement,
		private readonly fl: HTMLInputElement,
		private readonly fi: HTMLInputElement,
		private readonly fc: HTMLInputElement,
		private readonly L: HTMLInputElement,
		N: HTMLInputElement
	) {
		const change = (): void => {
			const invalid = this.inputs.filter(i => !i.checkValidity());
			this.inputs.forEach(i => i.classList.toggle("is-invalid", invalid.includes(i)));

			if (invalid.length > 0) {
				N.value = "Error:\n\n" + invalid.map(i => `• ${i.name}: ${i.validationMessage}`).join("\n");
				return;
			}

			const NValue = this.calculate();
			N.title = String(NValue);
			N.value = NValue.toFixed(6);
		}

		for (const i of this.inputs) {
			if (i.type === "number" && i.min !== "" && i.max !== "" && i.step !== "") {
				createLinkedRangeInput(i);
			}

			i.addEventListener("input", change);
		}

		change();
	}

	private calculate(): number {
		return drake(
			parseFloat(this.R.value),
			parseFloat(this.fp.value),
			parseFloat(this.ne.value),
			parseFloat(this.fl.value),
			parseFloat(this.fi.value),
			parseFloat(this.fc.value),
			parseFloat(this.L.value)
		);
	}
}

function createLinkedRangeInput(i: HTMLInputElement): HTMLInputElement {
	const rng = document.createElement("input");
	rng.type = "range";
	rng.min = i.min;
	rng.max = i.max;
	rng.step = i.step;
	rng.value = i.value;
	rng.style.display = 'block';
	i.parentElement!.insertBefore(rng, i.nextSibling);

	const syncValue = (source: HTMLInputElement, target: HTMLInputElement): void => {
		if (source.value !== target.value) {
			target.value = source.value;
			target.dispatchEvent(new Event("input"));
		}
	};

	rng.addEventListener("input", () => syncValue(rng, i));
	i.addEventListener("input", () => syncValue(i, rng));

	return rng;
}
