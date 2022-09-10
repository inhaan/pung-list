(() => {
    let pungList = [];

    document.addEventListener("DOMContentLoaded", () => {
        //생성
        document.getElementById("btn-create-5").onclick = onClickBtnCreate.bind(null, 5);
        document.getElementById("btn-create-10").onclick = onClickBtnCreate.bind(null, 10);
        document.getElementById("btn-create-20").onclick = onClickBtnCreate.bind(null, 20);

        //기능
        document.getElementById("btn-init").onclick = onClickBtnInit;
        document.getElementById("btn-double").onclick = onClickBtnDouble;
        document.getElementById("btn-extend-all-5").onclick = onClickBtnExtendAll.bind(null, 5);
        document.getElementById("btn-stop-all").onclick = onClickBtnStopAll;
        document.getElementById("btn-start-all").onclick = onClickBtnStartAll;

        //집계
        const totalEl = document.getElementById("total");
        const avgTimeEl = document.getElementById("avg-time");
        setInterval(() => {
            totalEl.textContent = pungList.length;
            avgTimeEl.textContent = (pungList.reduce((t, x) => t + x.time, 0) / (pungList.length || 1)).toFixed(1);
        }, 100);
    });

    function onClickBtnCreate(time) {
        const iptContentEl = document.getElementById("ipt-pung-content");
        const content = iptContentEl.value;
        if (!content) {
            alert("내용을 입력해 주세요");
            return;
        }

        const pung = createPung(content, time);
        addPung(pung);
        showPungList();

        iptContentEl.value = "";
        iptContentEl.focus();
    }

    function onClickBtnInit() {
        pungList = [];
        showPungList();
    }

    function onClickBtnDouble() {
        pungList = pungList.reduce((list, pung) => {
            return [...list, pung, createPung(pung.content, pung.time)];
        }, []);

        showPungList();
    }

    function onClickBtnExtendAll(time) {
        pungList.forEach((pung) => {
            pung.time += time;
            pung.renewTime();
        });
        showPungList();
    }

    function onClickBtnStopAll() {
        pungList.forEach((pung) => pung.stop());
    }

    function onClickBtnStartAll() {
        pungList.forEach((pung) => pung.start());
    }

    function createPungKey() {
        return Date.now() + Math.random();
    }

    function addPung(pung) {
        pungList.push(pung);
    }

    function removePung(key) {
        pungList = pungList.filter((x) => x.key !== key);
    }

    function createPung(content, time) {
        let timer = null;

        const liEl = document.createElement("li");

        const contentEl = document.createElement("span");
        contentEl.textContent = content;
        contentEl.style = "margin-right: 1rem";
        liEl.append(contentEl);

        const timeEl = document.createElement("span");
        timeEl.textContent = time;
        timeEl.className = "time";
        timeEl.style = "margin-right: 1rem";
        liEl.append(timeEl);

        const extBtnEl = document.createElement("button");
        extBtnEl.textContent = "+5초";
        liEl.append(extBtnEl);

        const stopGoBtnEl = document.createElement("button");
        liEl.append(stopGoBtnEl);

        const delBtnEl = document.createElement("button");
        delBtnEl.textContent = "삭제";
        liEl.append(delBtnEl);

        const pung = {
            key: createPungKey(),
            content,
            time,
            el: liEl,

            start() {
                if (timer != null) {
                    return;
                }

                timer = setInterval(() => {
                    --this.time;

                    //삭제
                    if (this.time <= 0) {
                        this.el.remove();
                        removePung(this.key);
                        return;
                    }

                    this.renewTime();
                }, 1000);

                this.renewTime();
                renewStopGoBtnLabel();
            },

            renewTime() {
                this.el.getElementsByClassName("time")[0].textContent = `${this.time}초`;
            },

            stop() {
                clearInterval(timer);
                timer = null;

                renewStopGoBtnLabel();
            },
        };

        extBtnEl.onclick = () => {
            pung.time += 5;
            pung.renewTime();
            showPungList();
        };

        stopGoBtnEl.onclick = () => {
            timer == null ? pung.start() : pung.stop();
        };

        delBtnEl.onclick = () => {
            removePung(pung.key);
            showPungList();
        };

        pung.start();
        return pung;

        function renewStopGoBtnLabel() {
            stopGoBtnEl.textContent = timer == null ? "시작" : "중지";
        }
    }

    function showPungList() {
        const pungListEl = document.getElementById("pung-list");
        pungListEl.innerHTML = "";

        pungList
            .sort((a, b) => a.time - b.time)
            .forEach((pung) => {
                pungListEl.append(pung.el);
            });
    }
})();
