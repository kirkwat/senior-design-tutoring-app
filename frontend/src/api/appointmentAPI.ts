import axios from "./axios";

export const getTutors = () => new Promise((resolve, reject) => {
    axios.get("/getTutors")
        .then(x => resolve(x.data))
        .catch(x => {
            alert(x);
            reject(x);
        });
});


