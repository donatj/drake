// Copyright 2023 Jesse G. Donat

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const drake = (R: number, fp: number, ne: number, fl: number, fi: number, fc: number, L: number) => R * fp * ne * fl * fi * fc * L;

class DrakeUI {
	public constructor(
		private R: HTMLInputElement,
		private fp: HTMLInputElement,
		private ne: HTMLInputElement,
		private fl: HTMLInputElement,
		private fi: HTMLInputElement,
		private fc: HTMLInputElement,
		private L: HTMLInputElement,
		private N: HTMLInputElement
	) {
		const inputs = this.inputs();

		const change = () => {
			let invalid = inputs.filter(i => !i.checkValidity());
			inputs.forEach(i => i.classList.remove("is-invalid"));
			invalid.forEach(i => i.classList.add("is-invalid"));

			if (invalid.length > 0) {
				this.N.value = "Error:\n\n" + invalid.map(i => `• ${i.name}: ${i.validationMessage}`).join("\n");
				return;
			}

			this.drakeItUp();
		}

		for (const i of inputs) {
			if (i.type === "number" && i.min !== "" && i.max !== "" && i.step !== "") {
				createLinkedRangeInput(i);
			}

			i.addEventListener("input", change);
		}

		change();
	}

	private inputs(): HTMLInputElement[] {
		return [
			this.R,
			this.fp,
			this.ne,
			this.fl,
			this.fi,
			this.fc,
			this.L
		];
	}

	private drakeItUp() {
		const N = drake(
			parseFloat(this.R.value),
			parseFloat(this.fp.value),
			parseFloat(this.ne.value),
			parseFloat(this.fl.value),
			parseFloat(this.fi.value),
			parseFloat(this.fc.value),
			parseFloat(this.L.value)
		);

		this.N.title = String(N);
		this.N.value = N.toFixed(6);
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

	const syncValue = function (source: HTMLInputElement, target: HTMLInputElement) {
		if (source.value !== target.value) {
			target.value = source.value;
			target.dispatchEvent(new Event("input"));
		}
	};

	rng.addEventListener("input", function () { syncValue(rng, i); });
	i.addEventListener("input", function () { syncValue(i, rng); });

	return rng;
}